import { prisma } from '@/lib/prisma'
import { ExperienceContent } from '@/components/sections/ExperienceContent'
import type { CompanyWithProjects } from '@/types'

export async function ExperienceSection() {
  const companies = await prisma.company.findMany({
    include: { projects: true },
    orderBy: { startDate: 'desc' },
  })

  const serialized: CompanyWithProjects[] = companies.map((c) => ({
    id: c.id,
    name: c.name,
    role: c.role,
    startDate: c.startDate.toISOString(),
    endDate: c.endDate ? c.endDate.toISOString() : null,
    isCurrent: c.isCurrent,
    description: c.description,
    logoUrl: c.logoUrl ?? null,
    projects: c.projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      techStack: p.techStack,
      achievements: p.achievements,
      thumbnailUrl: p.thumbnailUrl ?? null,
      githubUrl: p.githubUrl ?? null,
      demoUrl: p.demoUrl ?? null,
      companyId: p.companyId ?? null,
    })),
  }))

  return <ExperienceContent companies={serialized} />
}
