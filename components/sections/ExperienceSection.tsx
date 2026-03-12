import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { ExperienceContent } from '@/components/sections/ExperienceContent'
import type { CompanyWithProjects } from '@/feature/company/type'

const getCompanies = unstable_cache(
  async () => prisma.company.findMany({
    include: { projects: true },
    orderBy: { startDate: 'desc' },
  }),
  ['companies-initial'],
  { tags: ['companies'] }
)

export async function ExperienceSection() {
  const companies = await getCompanies()

  const serialized: CompanyWithProjects[] = companies.map((c) => ({
    id: c.id,
    name: c.name,
    role: c.role,
    startDate: new Date(c.startDate).toISOString(),
    endDate: c.endDate ? new Date(c.endDate).toISOString() : null,
    isCurrent: c.isCurrent,
    description: c.description,
    responsibilities: c.responsibilities ?? null,
    achievements: c.achievements ?? null,
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
