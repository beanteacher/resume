'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'
import type { PhilosophyDto } from '@/feature/philosophy/type'

interface PhilosophyListProps {
  philosophies: PhilosophyDto[]
  loading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function PhilosophyList({ philosophies, loading, onEdit, onDelete }: PhilosophyListProps) {
  if (loading) return <LoadingState />
  if (philosophies.length === 0) return <EmptyState title="등록된 가치관이 없습니다." />

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--elevated)]">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">아이콘</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">제목</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden md:table-cell">설명</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">액션</th>
            </tr>
          </thead>
          <tbody>
            {philosophies.map((item) => (
              <tr key={item.id} className="border-t border-[var(--border-color)] hover:bg-[var(--elevated)] transition-colors">
                <td className="px-4 py-3 text-2xl">{item.icon}</td>
                <td className="px-4 py-3 text-sm text-[var(--text)] font-medium">{item.title}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-muted)] hidden md:table-cell max-w-xs truncate">{item.desc}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item.id)}>수정</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item.id)}
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
