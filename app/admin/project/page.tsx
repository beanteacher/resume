'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ProjectList } from '@/components/admin/ProjectList'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { useProjectsQuery, useDeleteProjectMutation } from '@/feature/project/query'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { AdminAddButton } from '@/components/admin/AdminAddButton'

export default function AdminProjectPage() {
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: projects = [], isPending } = useProjectsQuery()
  const deleteMutation = useDeleteProjectMutation()

  const handleDelete = (id: number) => {
    if (!window.confirm('이 프로젝트를 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <AdminPageTitle title="프로젝트 관리" />
        <AdminAddButton label="프로젝트" onClick={() => setEditingId(0)} />
      </div>

      {editingId !== null && (
        <Card className="mb-6">
          <ProjectForm
            projectId={editingId === 0 ? null : editingId}
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <ProjectList
        projects={projects}
        loading={isPending}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
