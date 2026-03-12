'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'
import type { ProjectDto } from '@/feature/project/type'

interface ProjectListProps {
  projects: ProjectDto[]
  loading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function ProjectList({ projects, loading, onEdit, onDelete }: ProjectListProps) {
  if (loading) return <LoadingState />
  if (projects.length === 0) return <EmptyState title="등록된 프로젝트가 없습니다." />

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--elevated)]">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">프로젝트명</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden md:table-cell">회사</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)] hidden lg:table-cell">기술 스택</th>
              <th className="px-4 py-3 text-sm font-semibold text-[var(--text)]">액션</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              let techArr: string[] = []
              try {
                techArr = JSON.parse(project.techStack) as string[]
              } catch {
                techArr = []
              }
              return (
                <tr
                  key={project.id}
                  className="border-t border-[var(--border-color)] hover:bg-[var(--elevated)] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[var(--text)] font-medium max-w-[200px] truncate">
                    {project.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)] hidden md:table-cell">
                    {project.company ? project.company.name : '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {techArr.slice(0, 3).map((t) => (
                        <Badge key={t} variant="primary" size="sm">
                          {t}
                        </Badge>
                      ))}
                      {techArr.length > 3 && (
                        <Badge variant="secondary" size="sm">+{techArr.length - 3}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(project.id)}>
                        수정
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(project.id)}
                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
