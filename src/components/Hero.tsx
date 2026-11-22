import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const name = 'BAYU'.split('')

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section ref={ref} id="home" className="relative min-h-[100svh] overflow-hidden flex items-center justify-center">
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          className="h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/train-background.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,8,0.35),rgba(5,6,8,0.55)_45%,rgba(5,6,8,0.88))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,8,0.55),transparent_30%,transparent_70%,rgba(5,6,8,0.55))]" />

      <motion.div style={{ opacity, y: contentY }} className="relative z-10 section-shell py-28 sm:py-32 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="section-kicker mb-5"
        >
          HELLO, I&apos;M
        </motion.p>

        <h1 className="font-[Outfit] font-extrabold tracking-[-0.05em] leading-[0.88] text-[clamp(4.5rem,16vw,11rem)] text-white">
          <span className="sr-only">BAYU</span>
          <span aria-hidden="true" className="inline-flex overflow-hidden">
            {name.map((char, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block bg-[linear-gradient(180deg,#ffffff_30%,#aeb8c4_100%)] bg-clip-text text-transparent"
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-6 font-[Outfit] text-lg sm:text-2xl tracking-[0.08em] text-slate-200"
        >
          Developer <span className="text-[var(--smoke)]">&amp;</span> Creative Technologist
        </motion.p>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300/90"
        >
          Saya membangun pengalaman digital melalui coding, teknologi, kreativitas, dan eksplorasi ide baru.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => go('about')}
            className="group relative min-h-[52px] px-7 rounded-full bg-white text-[#0b0d11] font-medium transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
          >
            <span className="relative z-10">DISCOVER MY PROFILE</span>
          </button>
          <button
            onClick={() => go('tech-stack')}
            className="min-h-[52px] px-7 rounded-full border border-white/20 bg-white/[0.04] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] hover:border-white/30"
          >
            EXPLORE MY SKILLS
          </button>
        </motion.div>
      </motion.div>

      <motion.button
        aria-label="Scroll ke bagian About"
        onClick={() => go('about')}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-300/80"
      >
        <span className="text-[11px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={18} />
        </motion.span>
      </motion.button>
    </section>
  )
}
