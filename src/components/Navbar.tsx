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
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

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
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-[#050608]/45 backdrop-blur-md md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%', opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[58] w-[min(320px,calc(100vw-1.5rem))] md:hidden border-l border-white/10 bg-[linear-gradient(180deg,rgba(18,21,27,0.62),rgba(8,9,12,0.48))] backdrop-blur-2xl backdrop-saturate-150 shadow-[-24px_0_80px_rgba(0,0,0,0.45)]"
              aria-label="Menu navigasi mobile"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
                <span className="font-[Outfit] text-sm tracking-[0.24em] text-white">BAYU<span className="text-[var(--accent)]">.</span></span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Tutup menu"
                  className="h-10 w-10 rounded-full border border-white/10 bg-white/5 inline-flex items-center justify-center text-white hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {links.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    onClick={() => go(link.id)}
                    className={`rounded-2xl px-4 py-3.5 text-left text-base transition-all ${active === link.id ? 'bg-white/10 text-white border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent'}`}
                  >
                    <span className="flex items-center justify-between">
                      {link.label}
                      {active === link.id && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
                    </span>
                  </motion.button>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/8">
                <p className="text-xs tracking-[0.2em] uppercase text-slate-500">Developer &amp; Creative Technologist</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
