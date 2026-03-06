interface SectionProps {
  id: string
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-[var(--spacing-24)] px-6 scroll-mt-16 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {title && (
          <div className="mb-[var(--spacing-12)] text-center">
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
