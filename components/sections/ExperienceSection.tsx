'use client'

import { useCompaniesWithProjectsQuery } from '@/feature/company/query'
import { ExperienceContent } from '@/components/sections/ExperienceContent'

export function ExperienceSection() {
  const { data: companies = [], isPending } = useCompaniesWithProjectsQuery()

  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse h-40 rounded-[var(--radius-md)] bg-[var(--elevated)]" />
        ))}
      </div>
    )
  }

  return <ExperienceContent companies={companies} />
}
