export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-50 backdrop-blur-sm bg-[var(--bg)]/90">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-[var(--accent)] tracking-tight">aniyume</span>
        <span className="text-xs text-[var(--text)] bg-[var(--code-bg)] px-2 py-0.5 rounded-full">beta</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text)]">
        <a href="#" className="hover:text-[var(--text-h)] transition-colors">Home</a>
        <a href="#" className="hover:text-[var(--text-h)] transition-colors">Browse</a>
        <a href="#" className="hover:text-[var(--text-h)] transition-colors">Favorites</a>
      </nav>
      <div className="flex items-center gap-3">
        <button className="text-[var(--text)] hover:text-[var(--text-h)] transition-colors p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="bg-[var(--accent)] text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-[var(--accent)]/80 transition-colors">
          Sign In
        </button>
      </div>
    </header>
  )
}