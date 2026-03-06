import { prisma } from '@/lib/prisma'
import type { SkillsByCategory } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  Backend: 'Backend',
  Frontend: 'Frontend',
  Database: 'Database',
  DevOps: 'DevOps / Infra',
  Tool: 'Tool',
}

function ProficiencyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < level
              ? 'bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)]'
              : 'bg-[var(--border-color)]'
          }`}
        />
      ))}
    </div>
  )
}

function SkillRow({ name, proficiency }: { name: string; proficiency: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[var(--elevated)] border border-[var(--border-color)] rounded-[var(--radius-sm)] hover:border-[var(--color-brand-purple)]/50 transition-colors duration-[var(--transition-fast)]">
      <span className="text-[var(--font-size-body2)] text-[var(--text)] font-medium">{name}</span>
      <ProficiencyDots level={proficiency} />
    </div>
  )
}

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, catIdx) => (
          <div
            key={category}
            className="animate-[fade-up_0.5s_ease_both]"
            style={{ animationDelay: `${catIdx * 0.1}s` }}
          >
            <h3 className="text-[var(--font-size-body1)] font-[var(--font-weight-subheading)] mb-4 pb-2 border-b border-[var(--border-color)]">
              <span className="bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)] bg-clip-text text-transparent">
                {CATEGORY_LABELS[category] ?? category}
              </span>
            </h3>
            <div className="space-y-2">
              {grouped[category].map((skill) => (
                <SkillRow key={skill.id} name={skill.name} proficiency={skill.proficiency} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-6 text-[var(--font-size-caption)] text-[var(--text-muted)]">
        <span>숙련도</span>
        <div className="flex items-center gap-3">
          {[
            { label: '입문', level: 1 },
            { label: '활용', level: 3 },
            { label: '숙련', level: 5 },
          ].map(({ label, level }) => (
            <span key={label} className="flex items-center gap-1.5">
              <ProficiencyDots level={level} />
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
