export function Footer() {
  return (
    <footer className="py-10 border-t border-white/5">
      <div className="section-shell flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <p className="font-[Outfit] tracking-[0.18em] text-slate-300">BAYU <span className="text-slate-500">/ IBOYY</span></p>
        <p>© {new Date().getFullYear()} Bayu. Built with intent.</p>
      </div>
    </footer>
  )
}
