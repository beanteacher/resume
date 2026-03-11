'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProjectList } from '@/components/admin/ProjectList'
import { ProjectForm } from '@/components/admin/ProjectForm'
import type { SerializedProject, ApiResponse } from '@/types'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { AdminAddButton } from '@/components/admin/AdminAddButton'

export default function AdminProjectsPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: projects = [], isPending } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects')
      const json = await res.json() as ApiResponse<{ items: SerializedProject[] }>
      return json.data?.items ?? []
    },
    placeholderData: (prev: SerializedProject[] | undefined) => prev,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/projects/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })

  const handleDelete = (id: number) => {
    if (!window.confirm('이 프로젝트를 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  const handleFormSuccess = () => {
    setEditingId(null)
    void queryClient.invalidateQueries({ queryKey: ['projects'] })
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
            onSuccess={handleFormSuccess}
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
