'use client'

import { useInView } from '@/lib/hooks/useInView'
import type { PhilosophyDto } from '@/feature/philosophy/type'

interface PhilosophyCardProps {
  item: PhilosophyDto
  index: number
}

export function PhilosophyCard({ item, index }: PhilosophyCardProps) {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} 
      className="
        bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)]
        p-6 shadow-[var(--shadow-sm)]
        hover:shadow-[var(--shadow-md)] hover:border-[var(--color-brand-purple)]/50 hover:-translate-y-1
        transition-[box-shadow,border-color,transform] duration-[var(--transition-base)]
      "
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s, box-shadow var(--transition-base), border-color var(--transition-base)`,
      }}
    >
      <div className="text-3xl mb-3">{item.icon}</div>
      <h3 className="text-[var(--font-size-h3)] font-semibold text-[var(--text)] mb-2">
        {item.title}
      </h3>
      <p className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-relaxed">
        {item.desc}
      </p>
    </div>
  )
}
