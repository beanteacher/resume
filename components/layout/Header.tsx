'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#philosophy', label: 'Philosophy' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--transition-base)] ${
        isScrolled
          ? 'backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border-color)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-[var(--font-size-h3)] font-bold bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-cyan)] bg-clip-text text-transparent"
        >
          Portfolio
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[var(--text-muted)] hover:text-[var(--text)] text-[var(--font-size-body2)] transition-colors duration-[var(--transition-fast)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--elevated)] transition-all duration-[var(--transition-fast)]"
            aria-label="테마 전환"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text)] transition-all duration-[var(--transition-fast)]"
            aria-label="메뉴"
          >
            {isMobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden animate-[slide-down_0.2s_ease_both] border-t border-[var(--border-color)] bg-[var(--bg)]/95 backdrop-blur-md">
          <ul className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-[var(--text-muted)] hover:text-[var(--text)] text-[var(--font-size-body1)] transition-colors duration-[var(--transition-fast)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
