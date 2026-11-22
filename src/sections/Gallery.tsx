import { useEffect, useMemo, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'
import { galleryItems } from '../data/gallery'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Gallery() {
  const reduce = useReducedMotion()
  const items = galleryItems
  const [index, setIndex] = useState(0)
  const [full, setFull] = useState(false)
  const count = items.length

  const clampIndex = useCallback((i: number) => (i + count) % count, [count])
  const prev = useCallback(() => setIndex((i) => clampIndex(i - 1)), [clampIndex])
  const next = useCallback(() => setIndex((i) => clampIndex(i + 1)), [clampIndex])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (full && e.key === 'Escape') { setFull(false); return }
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [full, prev, next])

  const visible = useMemo(() => {
    const offsets = [-2, -1, 0, 1, 2]
    return offsets.map((off) => {
      const i = clampIndex(index + off)
      return { off, i, item: items[i] }
    })
  }, [index, items, clampIndex])

  let touchX = 0
  const onTouchStart = (e: React.TouchEvent) => { touchX = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 40) { if (dx > 0) prev(); else next() }
  }

  if (!count) {
    return (
      <section id="photo-album" className="py-24 sm:py-32">
        <div className="section-shell glass rounded-[28px] p-10 text-center">
          <p className="section-kicker">PHOTO ALBUM</p>
          <h2 className="section-title mt-4 font-[Outfit]">Galeri foto</h2>
          <p className="mt-4 text-slate-400">Foto album belum tersedia. Tambahkan foto ke <code className="text-slate-300">public/images/gallery/</code>.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="photo-album" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(126,182,255,0.06),transparent_35%)]" />
      <div className="section-shell relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="section-kicker">PHOTO ALBUM</p>
          <h2 className="section-title mt-4 font-[Outfit]">Momen di balik layar.</h2>
          <p className="mt-5 text-slate-300 leading-relaxed">Koleksi foto personal yang terpisah dari profil utama, ditampilkan dalam galeri interaktif.</p>
        </motion.div>

        <div className="mt-12 relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="relative h-[360px] sm:h-[460px] md:h-[520px] [perspective:1200px]">
            {visible.map(({ off, i, item }) => {
              const active = off === 0
              const hidden = Math.abs(off) > 2
              return (
                <motion.button
                  key={`${item.src}-${i}`}
                  type="button"
                  onClick={() => active ? setFull(true) : setIndex(i)}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden border border-white/10 bg-[#12151b] shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  initial={false}
                  animate={{
                    x: `calc(-50% + ${off * (typeof window !== 'undefined' && window.innerWidth < 640 ? 72 : 150)}px)`,
                    y: '-50%',
                    rotateY: off * -28,
                    scale: active ? 1 : Math.max(0.62, 1 - Math.abs(off) * 0.16),
                    zIndex: 10 - Math.abs(off),
                    opacity: hidden ? 0 : active ? 1 : 0.62,
                    filter: active ? 'brightness(1)' : 'brightness(0.55)',
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  style={{ width: 'min(72vw, 360px)', aspectRatio: '3 / 4', transformStyle: 'preserve-3d' }}
                  aria-label={active ? `Buka ${item.alt}` : `Lihat ${item.alt}`}
                >
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
                      <p className="text-sm text-white/90 text-left">{item.caption}</p>
                      <span className="glass-soft rounded-full p-2 text-white/80"><Maximize2 size={16} /></span>
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button onClick={prev} aria-label="Foto sebelumnya" className="glass-soft h-11 w-11 rounded-full inline-flex items-center justify-center text-white hover:bg-white/10"><ChevronLeft size={20} /></button>
            <div className="flex items-center gap-2 px-2">
              {items.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} aria-label={`Ke foto ${i + 1}`} className={`h-2.5 rounded-full transition-all ${i === index ? 'w-7 bg-[var(--accent)]' : 'w-2.5 bg-white/25 hover:bg-white/40'}`} />
              ))}
            </div>
            <button onClick={next} aria-label="Foto berikutnya" className="glass-soft h-11 w-11 rounded-full inline-flex items-center justify-center text-white hover:bg-white/10"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {full && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/88 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setFull(false)}
          >
            <button className="absolute top-4 right-4 glass-soft h-11 w-11 rounded-full inline-flex items-center justify-center text-white" aria-label="Tutup" onClick={() => setFull(false)}><X size={20} /></button>
            <motion.img
              initial={reduce ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { scale: 0.98, opacity: 0 }}
              src={items[index].src}
              alt={items[index].alt}
              className="max-h-[88vh] max-w-full rounded-2xl object-contain border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
