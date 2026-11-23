import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { techCategories, marqueeRows } from '../data/technologies'
import { ScrollVelocity } from '../components/ScrollVelocity'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function TechStack() {
  const [active, setActive] = useState(techCategories[0].id)
  const reduce = useReducedMotion()
  const activeCat = techCategories.find((c) => c.id === active) ?? techCategories[0]

  return (
    <section id="tech-stack" className="relative py-24 sm:py-32 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(126,182,255,0.08),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03),transparent_25%)]" />
      <div className="section-shell relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="section-kicker">TECH STACK &amp; SKILLS</p>
          <h2 className="section-title mt-4 font-[Outfit]">Teknologi yang saya jelajahi dan gunakan.</h2>
          <p className="mt-5 text-slate-300 leading-relaxed text-base sm:text-lg">
            Kumpulan bahasa, framework, tools, dan area teknologi yang saya pelajari, eksplorasi, dan gunakan untuk membangun pengalaman digital.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-2">
          {techCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`relative rounded-full px-4 py-2.5 text-sm transition-colors min-h-[44px] ${active === cat.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {active === cat.id && (
                <motion.span layoutId="tech-tab" className="absolute inset-0 rounded-full bg-white/10 border border-white/10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
              )}
              <span className="relative z-10">{cat.title}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 glass rounded-[28px] p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-slate-400 mb-6">{activeCat.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {activeCat.items.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.03 }}
                      whileHover={reduce ? undefined : { y: -4, scale: 1.01 }}
                      className="group glass-soft rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center gap-3 min-h-[132px] justify-center"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity" style={{ background: item.color }} />
                        <Icon className="relative w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110" style={{ color: item.color }} />
                      </div>
                      <span className="text-sm sm:text-[0.95rem] text-slate-200 font-medium leading-snug">{item.name}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-14 sm:mt-20">
        <ScrollVelocity rows={marqueeRows} />
      </div>
    </section>
  )
}
