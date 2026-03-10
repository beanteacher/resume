'use client'

import { useInView } from '@/lib/hooks/useInView'

interface SectionProps {
  id: string
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section id={id} className={`py-[var(--spacing-24)] px-6 scroll-mt-16 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {title && (
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="mb-[var(--spacing-12)] text-center"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <h2 className="text-[var(--font-size-h1)] font-bold text-[var(--text)] mb-3">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[var(--text-muted)] text-[var(--font-size-body1)]">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
