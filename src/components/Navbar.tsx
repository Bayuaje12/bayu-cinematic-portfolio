import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useScrollProgress } from '../hooks/useScrollProgress'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'tech-stack', label: 'Tech Stack' },
  { id: 'photo-album', label: 'Photo Album' },
  { id: 'contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const progress = useScrollProgress()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0.2, 0.4, 0.6] }
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-white/5">
        <div className="h-full bg-[linear-gradient(90deg,#8ea0b5,#7eb6ff)] origin-left" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <header className="fixed top-4 left-0 right-0 z-[60] px-4">
        <nav
          aria-label="Navigasi utama"
          className={`section-shell glass flex items-center justify-between rounded-full px-4 sm:px-6 py-3 transition-all duration-300 ${scrolled ? 'bg-white/[0.08]' : 'bg-white/[0.05]'}`}
        >
          <button onClick={() => go('home')} className="font-[Outfit] text-sm sm:text-base font-semibold tracking-[0.24em] text-white">
            BAYU<span className="text-[var(--accent)]">.</span>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${active === link.id ? 'text-white' : 'text-slate-300 hover:text-white'}`}
              >
                {active === link.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10 border border-white/10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </div>
          <button
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-[#050608]/70 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="glass section-shell mt-24 rounded-3xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => go(link.id)}
                    className={`rounded-2xl px-4 py-3 text-left text-base ${active === link.id ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
