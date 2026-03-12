import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { ProjectsContent } from './ProjectsContent'
import type { ProjectDto } from '@/feature/project/type'

const LIMIT = 6

const getInitialProjects = unstable_cache(
  async () => {
    return prisma.project.findMany({
      take: LIMIT + 1,
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    })
  },
  ['projects-initial'],
  { tags: ['projects'] }
)

export async function ProjectsSection() {
  const raw = await getInitialProjects()

  const hasMore = raw.length > LIMIT
  const slice = hasMore ? raw.slice(0, LIMIT) : raw
  const nextCursor = hasMore ? slice[slice.length - 1].id : null

  const initialItems: ProjectDto[] = slice.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    techStack: p.techStack,
    achievements: p.achievements,
    thumbnailUrl: p.thumbnailUrl,
    githubUrl: p.githubUrl,
    demoUrl: p.demoUrl,
    companyId: p.companyId,
    createdAt: new Date(p.createdAt).toISOString(),
    updatedAt: new Date(p.updatedAt).toISOString(),
    company: p.company
      ? {
          id: p.company.id,
          name: p.company.name,
          role: p.company.role,
          startDate: new Date(p.company.startDate).toISOString(),
          endDate: p.company.endDate ? new Date(p.company.endDate).toISOString() : null,
          isCurrent: p.company.isCurrent,
          description: p.company.description,
          responsibilities: p.company.responsibilities ?? null,
          achievements: p.company.achievements ?? null,
          logoUrl: p.company.logoUrl,
          createdAt: new Date(p.company.createdAt).toISOString(),
          updatedAt: new Date(p.company.updatedAt).toISOString(),
        }
      : null,
  }))

  return <ProjectsContent initialItems={initialItems} initialCursor={nextCursor} />
}
