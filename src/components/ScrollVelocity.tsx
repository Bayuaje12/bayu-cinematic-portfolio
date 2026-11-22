import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = { rows: string[][] }

export function ScrollVelocity({ rows }: Props) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const pos = useRef<number[]>([0, 0])
  const lastY = useRef(0)
  const vel = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      vel.current = Math.max(-60, Math.min(60, y - lastY.current))
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const tick = () => {
      vel.current *= 0.94
      const base = reduce ? 0.25 : 0.6
      rowRefs.current.forEach((el, i) => {
        if (!el) return
        const dir = i % 2 === 0 ? 1 : -1
        pos.current[i] += (base + Math.abs(vel.current) * 0.08) * dir * (vel.current < 0 ? -1 : 1)
        const width = el.scrollWidth / 2
        if (width > 0) {
          if (pos.current[i] <= -width) pos.current[i] += width
          if (pos.current[i] >= 0) pos.current[i] -= width
        }
        el.style.transform = `translate3d(${pos.current[i]}px,0,0)`
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf.current)
    }
  }, [reduce])

  return (
    <div ref={wrapRef} className="overflow-hidden py-6 sm:py-8 border-y border-white/5 bg-white/[0.015]">
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="overflow-hidden">
            <div
              ref={(el) => { rowRefs.current[i] = el }}
              className="flex w-max gap-6 sm:gap-10 whitespace-nowrap will-change-transform"
            >
              {[...row, ...row, ...row, ...row].map((text, j) => (
                <span
                  key={`${text}-${j}`}
                  className="font-[Outfit] text-[clamp(1.1rem,3vw,2.2rem)] font-semibold tracking-[0.08em] text-slate-300/80"
                >
                  {text} <span className="text-[var(--accent)]/50 mx-2">/</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
