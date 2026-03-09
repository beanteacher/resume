'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EducationList } from '@/components/admin/EducationList'
import { EducationForm } from '@/components/admin/EducationForm'
import type { SerializedEducation, ApiResponse } from '@/types'

export default function AdminEducationPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: educations = [], isPending } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const res = await fetch('/api/education')
      const json = await res.json() as ApiResponse<SerializedEducation[]>
      return json.data ?? []
    },
    placeholderData: (prev) => prev,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/education/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['education'] }),
  })

  const handleDelete = (id: number) => {
    if (!window.confirm('이 항목을 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  const handleFormSuccess = () => {
    setEditingId(null)
    void queryClient.invalidateQueries({ queryKey: ['education'] })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">학력 / 교육 관리</h1>
        <Button variant="primary" onClick={() => setEditingId(0)}>
          + 항목 추가
        </Button>
      </div>

      {editingId !== null && (
        <Card className="mb-6">
          <EducationForm
            educationId={editingId === 0 ? null : editingId}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <EducationList
        educations={educations}
        loading={isPending}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
