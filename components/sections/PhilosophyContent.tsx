'use client'

import { usePhilosophiesQuery } from '@/feature/philosophy/query'
import { PhilosophyCard } from './PhilosophyCard'

export function PhilosophyContent() {
  const { data: items = [], isPending } = usePhilosophiesQuery()

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse h-36 rounded-[var(--radius-md)] bg-[var(--elevated)]" />
        ))}
      </div>
      
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {items.map((item, index) => (
        <PhilosophyCard key={item.id} item={item} index={index} />
      ))}
    </div>
  )
}
