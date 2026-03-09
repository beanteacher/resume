'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'
import type { SerializedCompany } from '@/types'

interface CompanyListProps {
  companies: SerializedCompany[]
  loading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function CompanyList({ companies, loading, onEdit, onDelete }: CompanyListProps) {
  if (loading) return <LoadingState />
  if (companies.length === 0) return <EmptyState title="등록된 회사가 없습니다." />

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--elevated)]">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">회사명</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">직책</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden md:table-cell">기간</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">상태</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">액션</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr
                key={company.id}
                className="border-t border-[var(--border-color)] hover:bg-[var(--elevated)] transition-colors"
              >
                <td className="px-4 py-3 text-sm text-[var(--text)] font-medium">{company.name}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{company.role}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-muted)] hidden md:table-cell">
                  {new Date(company.startDate).toLocaleDateString('ko-KR')}
                  {company.endDate
                    ? ` ~ ${new Date(company.endDate).toLocaleDateString('ko-KR')}`
                    : ' ~ 현재'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={company.isCurrent ? 'success' : 'secondary'}>
                    {company.isCurrent ? '재직중' : '완료'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(company.id)}>
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(company.id)}
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
