import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = {
  onDone: () => void
}

export function CinematicPreloader({ onDone }: Props) {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState(0)
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)

  const timings = useMemo(() => {
    if (reduce) return [350, 700, 1050, 1500]
    return [900, 1900, 3000, 3900]
  }, [reduce])

  useEffect(() => {

    const onLoad = () => setReady(true)
    if (document.readyState === 'complete') setReady(true)
    else window.addEventListener('load', onLoad, { once: true })

    const timers = timings.map((ms, i) => window.setTimeout(() => setStage(i + 1), ms))
    const maxTimer = window.setTimeout(() => setReady(true), 5000)
    return () => {
      window.removeEventListener('load', onLoad)
      timers.forEach(clearTimeout)
      window.clearTimeout(maxTimer)
    }
  }, [timings])

  useEffect(() => {
    if (done) return
    if (stage >= 4 && ready) {
      const t = window.setTimeout(() => {
        setDone(true)
        onDone()
      }, reduce ? 120 : 350)
      return () => window.clearTimeout(t)
    }
  }, [stage, ready, done, onDone, reduce])

  const progress = Math.min(stage / 4, ready ? 1 : 0.9)

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050608] text-white overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Intro loading"
          role="status"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(126,182,255,0.08),transparent_35%),radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

          <div className="relative w-full px-6 text-center">
            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.p
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
                  transition={{ duration: reduce ? 0.2 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="font-[Outfit] font-semibold tracking-[0.28em] text-[clamp(2rem,8vw,6rem)] text-white"
                >
                  WELCOME
                </motion.p>
              )}

              {stage === 2 && (
                <motion.p
                  key="portfolio"
                  initial={{ opacity: 0, y: 20, clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                  transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="font-[Outfit] font-semibold tracking-[0.18em] text-[clamp(2rem,7vw,5.5rem)] text-slate-100"
                >
                  MY PORTFOLIO
                </motion.p>
              )}

              {stage >= 3 && (
                <motion.div
                  key="bayu"
                  initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center"
                >
                  <p className="font-[Outfit] font-extrabold tracking-[-0.04em] leading-[0.9] text-[clamp(4.5rem,15vw,10rem)] bg-[linear-gradient(180deg,#ffffff_30%,#a7b3c2_100%)] bg-clip-text text-transparent">
                    {'BAYU.'.split('').map((ch, i) => (
                      <motion.span
                        key={i}
                        initial={reduce ? false : { opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: reduce ? 0 : 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block"
                      >
                        {ch}
                      </motion.span>
                    ))}
                  </p>
                  <motion.p
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: reduce ? 0 : 0.45 }}
                    className="mt-5 text-[11px] sm:text-sm tracking-[0.35em] text-slate-400 uppercase"
                  >
                    Developer <span className="text-[var(--accent)]/70">&amp;</span> Creative Technologist
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[min(240px,calc(100vw-3rem))]">
            <div className="h-[2px] rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.5),rgba(126,182,255,0.9))]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
