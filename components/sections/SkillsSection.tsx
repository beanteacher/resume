import { prisma } from '@/lib/prisma'
import type { SkillsByCategory } from '@/types'
import { SkillsContent } from './SkillsContent'

export async function SkillsSection() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  })

  const grouped = skills.reduce<SkillsByCategory>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  return <SkillsContent grouped={grouped} categories={categories} />
}
