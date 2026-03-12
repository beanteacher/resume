import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { SkillsByCategory } from '@/feature/skill/type'
import { SkillsContent } from './SkillsContent'

const getSkills = unstable_cache(
  async () => prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  }),
  ['skills-initial'],
  { tags: ['skills'] }
)

export async function SkillsSection() {
  const skills = await getSkills()

  const grouped = skills.reduce<SkillsByCategory>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  return <SkillsContent grouped={grouped} categories={categories} />
}
