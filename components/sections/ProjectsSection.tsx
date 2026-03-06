import { prisma } from '@/lib/prisma'
import { ProjectsContent } from './ProjectsContent'
import type { SerializedProject } from '@/types'

export async function ProjectsSection() {
  const LIMIT = 6
  const raw = await prisma.project.findMany({
    take: LIMIT + 1,
    include: { company: true },
    orderBy: { createdAt: 'desc' },
  })

  const hasMore = raw.length > LIMIT
  const slice = hasMore ? raw.slice(0, LIMIT) : raw
  const nextCursor = hasMore ? slice[slice.length - 1].id : null

  const initialItems: SerializedProject[] = slice.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    techStack: p.techStack,
    achievements: p.achievements,
    thumbnailUrl: p.thumbnailUrl,
    githubUrl: p.githubUrl,
    demoUrl: p.demoUrl,
    companyId: p.companyId,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    company: p.company
      ? {
          id: p.company.id,
          name: p.company.name,
          role: p.company.role,
          startDate: p.company.startDate.toISOString(),
          endDate: p.company.endDate?.toISOString() ?? null,
          isCurrent: p.company.isCurrent,
          description: p.company.description,
          logoUrl: p.company.logoUrl,
          createdAt: p.company.createdAt.toISOString(),
          updatedAt: p.company.updatedAt.toISOString(),
        }
      : null,
  }))

  return <ProjectsContent initialItems={initialItems} initialCursor={nextCursor} />
}
