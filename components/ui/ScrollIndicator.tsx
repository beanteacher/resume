'use client'

import { useState, useEffect } from 'react'

export function ScrollIndicator() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY < 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <a
      href="#about"
      aria-label="아래로 스크롤"
      className={`inline-flex flex-col items-center gap-1 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <span className="text-[var(--text-muted)] text-[var(--font-size-caption)]">scroll</span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="animate-bounce text-[var(--color-brand-purple)]"
        aria-hidden="true"
      >
        <path
          d="M12 5v14M5 12l7 7 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}
