import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = {
  src: string
  alt: string
}

const CFG = {
  foilColor: '#e2e6ec',
  intensity: 0.85,
  scale: 1,
  edgeSparkle: 0.8,
  frame: 4,
  glare: 0.5,
  tiltMax: 14,
  hoverScale: 1.04,
  radius: 14,
  idle: true,
  shadow: true,
}

function hexToRgb(hex: string) {
  const n = hex.replace('#', '')
  const v = parseInt(n, 16)
  return [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255] as const
}

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = vec2((a_pos.x + 1.0) * 0.5, 1.0 - (a_pos.y + 1.0) * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D u_img;
uniform vec2 u_res;
uniform vec2 u_tilt;
uniform float u_time;
uniform float u_hover;
uniform vec3 u_foil;
uniform float u_intensity;
uniform float u_glare;
uniform float u_sparkle;

float hash(vec2 p){
  p = fract(p*vec2(123.34, 456.21));
  p += dot(p, p+45.32);
  return fract(p.x*p.y);
}

void main(){
  vec2 uv = v_uv;
  vec2 p = uv - 0.5;
  float r = length(p);
  vec2 tilt = u_tilt * 0.018;
  vec2 uv2 = uv + tilt * (0.5 - r);
  vec4 base = texture(u_img, clamp(uv2, 0.001, 0.999));

  float diag = (uv.x + uv.y) * 0.5;
  float bands = sin((diag * 18.0 + u_time * 0.25 + tilt.x * 3.0) * 6.2831);
  bands = smoothstep(0.2, 1.0, bands);
  vec3 rainbow = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0,0.33,0.67) + diag * 1.4 + u_time * 0.03 + tilt.x));
  vec3 foil = mix(u_foil, rainbow, 0.55) * bands;

  float glarePos = length(uv - (0.5 + tilt * 6.0));
  float glare = smoothstep(0.55, 0.0, glarePos) * u_glare;

  float edge = smoothstep(0.32, 0.52, r);
  float sparkle = hash(uv * u_res * 0.35 + u_time * 0.5);
  sparkle = pow(sparkle, 18.0) * edge * u_sparkle * (0.4 + u_hover);

  vec3 color = base.rgb;
  color += foil * 0.22 * u_intensity;
  color += vec3(1.0) * glare * 0.28 * u_intensity;
  color += vec3(1.0, 0.96, 0.9) * sparkle * 1.8;

  float vign = smoothstep(0.85, 0.2, r);
  color *= mix(0.82, 1.0, vign);

  outColor = vec4(color, base.a);
}`

export function HoloCard({ src, alt }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const [fallback, setFallback] = useState(false)
  const [ready, setReady] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false })
    if (!gl) { setFallback(true); return }

    let raf = 0
    let lost = false
    let hover = 0
    let hoverTarget = 0
    let rx = 0, ry = 0, trx = 0, try_ = 0
    let width = 0, height = 0

    const compile = (type: number, srcCode: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, srcCode)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader')
      return s
    }

    let prog: WebGLProgram
    try {
      prog = gl.createProgram()!
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link')
    } catch {
      setFallback(true)
      return
    }

    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uImg = gl.getUniformLocation(prog, 'u_img')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTilt = gl.getUniformLocation(prog, 'u_tilt')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uHover = gl.getUniformLocation(prog, 'u_hover')
    const uFoil = gl.getUniformLocation(prog, 'u_foil')
    const uIntensity = gl.getUniformLocation(prog, 'u_intensity')
    const uGlare = gl.getUniformLocation(prog, 'u_glare')
    const uSparkle = gl.getUniformLocation(prog, 'u_sparkle')
    const foil = hexToRgb(CFG.foilColor)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.src = src
    img.onload = () => {
      if (lost) return
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      setReady(true)
    }
    img.onerror = () => setFallback(true)

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.floor(rect.width * dpr))
      height = Math.max(1, Math.floor(rect.height * dpr))
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      gl.viewport(0, 0, width, height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      try_ = -py * CFG.tiltMax
      trx = px * CFG.tiltMax
      hoverTarget = 1
    }
    const onLeave = () => { hoverTarget = 0; trx = 0; try_ = 0 }
    wrap.addEventListener('pointermove', onMove)
    wrap.addEventListener('pointerleave', onLeave)
    wrap.addEventListener('pointerdown', onMove)

    const onLost = (e: Event) => { e.preventDefault(); lost = true; cancelAnimationFrame(raf) }
    const onRestored = () => { lost = false; setFallback(true) }
    canvas.addEventListener('webglcontextlost', onLost as EventListener)
    canvas.addEventListener('webglcontextrestored', onRestored as EventListener)

    const start = performance.now()
    const render = (now: number) => {
      if (lost) return
      const t = (now - start) / 1000
      const idleX = !reduce && CFG.idle ? Math.sin(t * 0.7) * 2.2 : 0
      const idleY = !reduce && CFG.idle ? Math.cos(t * 0.55) * 2.2 : 0
      rx += ((try_ + idleY) - rx) * 0.08
      ry += ((trx + idleX) - ry) * 0.08
      hover += (hoverTarget - hover) * 0.08
      wrap.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${CFG.scale + hover * (CFG.hoverScale - 1)})`
      gl.clearColor(0,0,0,0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(prog)
      gl.uniform1i(uImg, 0)
      gl.uniform2f(uRes, width, height)
      gl.uniform2f(uTilt, ry / CFG.tiltMax, -rx / CFG.tiltMax)
      gl.uniform1f(uTime, t)
      gl.uniform1f(uHover, hover)
      gl.uniform3f(uFoil, foil[0], foil[1], foil[2])
      gl.uniform1f(uIntensity, CFG.intensity)
      gl.uniform1f(uGlare, CFG.glare)
      gl.uniform1f(uSparkle, CFG.edgeSparkle)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('pointerdown', onMove)
      canvas.removeEventListener('webglcontextlost', onLost as EventListener)
      canvas.removeEventListener('webglcontextrestored', onRestored as EventListener)
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [src, reduce])

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-[420px] aspect-[3/4] transition-transform duration-200 will-change-transform"
      style={{
        borderRadius: CFG.radius + CFG.frame,
        boxShadow: CFG.shadow ? '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)' : undefined,
      }}
    >
      <div className="absolute inset-0 rounded-[18px] p-[4px] bg-[linear-gradient(145deg,rgba(255,255,255,0.32),rgba(255,255,255,0.06)_35%,rgba(126,182,255,0.18)_65%,rgba(255,255,255,0.18))]">
        <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-[#12151b]">
          {!fallback && (
            <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`} />
          )}
          {(fallback || !ready) && !imgError && (
            <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="eager" onError={() => setImgError(true)} />
          )}
          {imgError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(160deg,#171b22,#0c0f14)] text-slate-400">
              <div className="text-center px-6">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full border border-white/10 bg-white/5" />
                <p className="text-sm tracking-[0.2em] uppercase">Portrait pending</p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[14px]" />
        </div>
      </div>
    </div>
  )
}
