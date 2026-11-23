import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function About() {
  const reduce = useReducedMotion()
  return (
    <section id="about" className="relative pt-14 pb-20 sm:pt-20 sm:pb-28 scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(126,182,255,0.08),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.04),transparent_30%)]" />
      <div className="section-shell relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="glass rounded-[28px] p-7 sm:p-10 lg:p-12 max-w-4xl mx-auto"
        >
          <p className="section-kicker">ABOUT ME</p>
          <h2 className="section-title mt-4 font-[Outfit]">
            Hi, I&apos;m <span className="text-[var(--silver)]">Bayu</span>.
          </h2>
          <p className="mt-3 font-[Outfit] text-lg sm:text-xl text-slate-300">
            Developer <span className="text-slate-500">&amp;</span> Creative Technologist
          </p>
          <div className="mt-8 space-y-5 text-slate-300 leading-relaxed text-base sm:text-lg max-w-3xl">
            <p>
              Saya memiliki ketertarikan terhadap pengembangan website, teknologi modern, AI Agent, bot development, dan berbagai inovasi digital. Saya senang mempelajari hal baru dan mengubah ide menjadi sesuatu yang nyata.
            </p>
            <p className="text-slate-400">
              Untuk saya, teknologi bukan hanya soal kode, tapi juga tentang menciptakan pengalaman digital yang terasa hidup, bermakna, dan punya karakter.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="glass-soft rounded-full px-4 py-2 text-sm text-slate-200">IBOYY</span>
            <span className="glass-soft rounded-full px-4 py-2 text-sm text-slate-300">Coding &amp; Creativity</span>
            <span className="glass-soft rounded-full px-4 py-2 text-sm text-slate-300">Digital Exploration</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
