import { motion } from 'framer-motion'
import { SiInstagram, SiTiktok } from 'react-icons/si'
import { ArrowUpRight } from 'lucide-react'
import { socialLinks } from '../data/social'
import { useReducedMotion } from '../hooks/useReducedMotion'

const icons = { tiktok: SiTiktok, instagram: SiInstagram } as const

export function Contact() {
  const reduce = useReducedMotion()
  return (
    <section id="contact" className="relative py-24 sm:py-32 scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,182,255,0.08),transparent_35%)]" />
      <div className="section-shell relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="glass rounded-[32px] p-8 sm:p-12 text-center max-w-4xl mx-auto"
        >
          <p className="section-kicker">CONTACT</p>
          <h2 className="section-title mt-4 font-[Outfit]">LET&apos;S CONNECT.</h2>
          <p className="mt-5 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have an idea, collaboration, or something interesting to build? Let&apos;s connect.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {socialLinks.map((link) => {
              const Icon = icons[link.id]
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="glass-soft rounded-2xl p-5 flex items-center gap-4 text-left hover:bg-white/[0.07] transition-colors group"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium">{link.label}</p>
                    <p className="text-slate-400 text-sm truncate">{link.handle}</p>
                  </div>
                  <ArrowUpRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
