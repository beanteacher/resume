'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { PhilosophyList } from '@/components/admin/PhilosophyList'
import { PhilosophyForm } from '@/components/admin/PhilosophyForm'
import { usePhilosophiesQuery, useDeletePhilosophyMutation } from '@/feature/philosophy/query'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { AdminAddButton } from '@/components/admin/AdminAddButton'

export default function AdminPhilosophyPage() {
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: philosophies = [], isPending } = usePhilosophiesQuery()
  const deleteMutation = useDeletePhilosophyMutation()

  const handleDelete = (id: number) => {
    if (!window.confirm('이 항목을 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <AdminPageTitle title="가치관 (Philosophy) 관리" />
        <AdminAddButton label="가치관" onClick={() => setEditingId(0)} />
      </div>

      {editingId !== null && (
        <Card className="mb-6">
          <PhilosophyForm
            philosophyId={editingId === 0 ? null : editingId}
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <PhilosophyList
        philosophies={philosophies}
        loading={isPending}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
