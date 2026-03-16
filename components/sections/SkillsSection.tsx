'use client'

import { useSkillsQuery } from '@/feature/skill/query'
import { SkillsContent } from './SkillsContent'

export function SkillsSection() {
  const { data: grouped = {}, isPending } = useSkillsQuery()

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse h-32 rounded-[var(--radius-md)] bg-[var(--elevated)]" />
        ))}
      </div>
    )
  }

  const categories = Object.keys(grouped)

  return <SkillsContent grouped={grouped} categories={categories} />
}
