'use client'

import { useInView } from '@/lib/hooks/useInView'
import type { SkillsByCategory } from '@/types'

type SkillItem = SkillsByCategory[string][number]

const CATEGORY_LABELS: Record<string, string> = {
  Backend: 'Backend',
  Frontend: 'Frontend',
  Database: 'Database',
  DevOps: 'DevOps / Infra',
  Tool: 'Tool',
}

function ProficiencyDots({ level, isVisible = true }: { level: number; isVisible?: boolean }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < level
              ? 'bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)]'
              : 'bg-[var(--border-color)]'
          }`}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            transition: `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  )
}

function SkillRow({
  name,
  proficiency,
  isVisible,
}: Pick<SkillItem, 'name' | 'proficiency'> & { isVisible: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[var(--elevated)] border border-[var(--border-color)] rounded-[var(--radius-sm)] hover:border-[var(--color-brand-purple)]/50 transition-colors duration-[var(--transition-fast)]">
      <span className="text-[var(--font-size-body2)] text-[var(--text)] font-medium">{name}</span>
      <ProficiencyDots level={proficiency} isVisible={isVisible} />
    </div>
  )
}

function CategoryCard({
  category,
  skills,
  index,
}: {
  category: string
  skills: SkillItem[]
  index: number
}) {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <h3 className="text-[var(--font-size-body1)] font-[var(--font-weight-subheading)] mb-4 pb-2 border-b border-[var(--border-color)]">
        <span className="bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)] bg-clip-text text-transparent">
          {CATEGORY_LABELS[category] ?? category}
        </span>
      </h3>
      <div className="space-y-2">
        {skills.map((skill) => (
          <SkillRow key={skill.id} name={skill.name} proficiency={skill.proficiency} isVisible={isInView} />
        ))}
      </div>
    </div>
  )
}

interface SkillsContentProps {
  grouped: SkillsByCategory
  categories: string[]
}

export function SkillsContent({ grouped, categories }: SkillsContentProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, catIdx) => (
          <CategoryCard
            key={category}
            category={category}
            skills={grouped[category]}
            index={catIdx}
          />
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
