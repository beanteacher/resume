export function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] py-8 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[var(--text-muted)] text-[var(--font-size-caption)]">
          © 2026 김개발. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/beanteacher"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text)] text-[var(--font-size-caption)] transition-colors duration-[var(--transition-fast)]"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/example"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text)] text-[var(--font-size-caption)] transition-colors duration-[var(--transition-fast)]"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
