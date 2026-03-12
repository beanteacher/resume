'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { EducationList } from '@/components/admin/EducationList'
import { EducationForm } from '@/components/admin/EducationForm'
import { useEducationsQuery, useDeleteEducationMutation } from '@/feature/education/query'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { AdminAddButton } from '@/components/admin/AdminAddButton'

export default function AdminEducationPage() {
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: educations = [], isPending } = useEducationsQuery()
  const deleteMutation = useDeleteEducationMutation()

  const handleDelete = (id: number) => {
    if (!window.confirm('이 항목을 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <AdminPageTitle title="학력 / 교육 관리" />
        <AdminAddButton label="항목" onClick={() => setEditingId(0)} />
      </div>

      {editingId !== null && (
        <Card className="mb-6">
          <EducationForm
            educationId={editingId === 0 ? null : editingId}
            onSuccess={() => setEditingId(null)}
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
