'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'
import type { EducationDto } from '@/feature/education/type'

interface EducationListProps {
  educations: EducationDto[]
  loading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const TYPE_LABEL: Record<string, string> = {
  university: '대학교',
  bootcamp: '부트캠프',
  certificate: '자격증',
}

export function EducationList({ educations, loading, onEdit, onDelete }: EducationListProps) {
  if (loading) return <LoadingState />
  if (educations.length === 0) return <EmptyState title="등록된 학력/교육이 없습니다." />

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--elevated)]">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">기관명</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden md:table-cell">전공/과정</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">유형</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden md:table-cell">기간</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">액션</th>
            </tr>
          </thead>
          <tbody>
            {educations.map((edu) => (
              <tr key={edu.id} className="border-t border-[var(--border-color)] hover:bg-[var(--elevated)] transition-colors">
                <td className="px-4 py-3 text-sm text-[var(--text)] font-medium">{edu.name}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-muted)] hidden md:table-cell">{edu.course}</td>
                <td className="px-4 py-3">
                  <Badge variant={edu.type === 'university' ? 'primary' : 'secondary'} size="sm">
                    {TYPE_LABEL[edu.type] ?? edu.type}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-muted)] hidden md:table-cell">
                  {new Date(edu.startDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit' })}
                  {edu.endDate
                    ? ` ~ ${new Date(edu.endDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit' })}`
                    : ' ~ 현재'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(edu.id)}>수정</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(edu.id)}
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
  )
}
