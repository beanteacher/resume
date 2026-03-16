'use client'

import { useStandaloneProjectsQuery } from '@/feature/project/query'
import { ProjectsContent } from './ProjectsContent'

export function ProjectsSection() {
  const { data: projects = [], isPending } = useStandaloneProjectsQuery()

  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse h-40 rounded-[var(--radius-md)] bg-[var(--elevated)]" />
        ))}
      </div>
    )
  }

  return <ProjectsContent projects={projects} />
}
