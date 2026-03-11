import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { EducationContent } from '@/components/sections/EducationContent'
import type { SerializedEducation } from '@/types'

const getEducations = unstable_cache(
  async () => prisma.education.findMany({
    orderBy: { startDate: 'desc' },
  }),
  ['education-initial'],
  { tags: ['education'] }
)

export async function EducationSection() {
  const educations = await getEducations()

  const serialized: SerializedEducation[] = educations.map((e) => ({
    id: e.id,
    name: e.name,
    course: e.course,
    type: e.type,
    startDate: new Date(e.startDate).toISOString(),
    endDate: e.endDate ? new Date(e.endDate).toISOString() : null,
    isCurrent: e.isCurrent,
    description: e.description,
    createdAt: new Date(e.createdAt).toISOString(),
    updatedAt: new Date(e.updatedAt).toISOString(),
  }))

  return <EducationContent educations={serialized} />
}
