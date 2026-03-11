'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { SkillList } from '@/components/admin/SkillList'
import { SkillForm } from '@/components/admin/SkillForm'
import type { SkillsByCategory, ApiResponse } from '@/types'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { AdminAddButton } from '@/components/admin/AdminAddButton'

export default function AdminSkillsPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: skills = {}, isPending } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await fetch('/api/skills')
      const json = await res.json() as ApiResponse<SkillsByCategory>
      return json.data ?? {}
    },
    placeholderData: (prev: SkillsByCategory | undefined) => prev,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/skills/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  })

  const reorderMutation = useMutation({
    mutationFn: (updates: Array<{ id: number; sortOrder: number }>) =>
      fetch('/api/skills/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  })

  const handleDelete = (id: number) => {
    if (!window.confirm('이 스킬을 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  const handleReorder = (updates: Array<{ id: number; sortOrder: number }>) => {
    reorderMutation.mutate(updates)
  }

  const handleFormSuccess = () => {
    setEditingId(null)
    void queryClient.invalidateQueries({ queryKey: ['skills'] })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <AdminPageTitle title="스킬 관리" />
        <AdminAddButton label="스킬" onClick={() => setEditingId(0)} />
      </div>

      {editingId !== null && (
        <Card className="mb-6">
          <SkillForm
            skillId={editingId === 0 ? null : editingId}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <SkillList
        skills={skills}
        loading={isPending}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </div>
  )
}
