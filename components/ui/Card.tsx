interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)]
        p-6 shadow-[var(--shadow-sm)]
        ${hover ? 'transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-brand-purple)]/50 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
