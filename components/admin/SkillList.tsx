'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'
import type { SkillsByCategory } from '@/types'

interface SkillListProps {
  skills: SkillsByCategory
  loading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const PROFICIENCY_STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export function SkillList({ skills, loading, onEdit, onDelete }: SkillListProps) {
  if (loading) return <LoadingState />

  const categories = Object.keys(skills)
  if (categories.length === 0) return <EmptyState title="등록된 스킬이 없습니다." />

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category} className="p-0 overflow-hidden">
          <div className="px-4 py-3 bg-[var(--elevated)] border-b border-[var(--border-color)]">
            <h3 className="text-sm font-semibold text-[var(--color-brand-purple)]">{category}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">스킬명</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden sm:table-cell">숙련도</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden md:table-cell">정렬</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">액션</th>
                </tr>
              </thead>
              <tbody>
                {skills[category].map((skill) => (
                  <tr
                    key={skill.id}
                    className="border-t border-[var(--border-color)] hover:bg-[var(--elevated)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text)]">{skill.name}</span>
                        <Badge variant="secondary" size="sm">{skill.category}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-yellow-400 hidden sm:table-cell tracking-wide">
                      {PROFICIENCY_STARS(skill.proficiency)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)] hidden md:table-cell">
                      {skill.sortOrder}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(skill.id)}>
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(skill.id)}
                          className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  )
}
