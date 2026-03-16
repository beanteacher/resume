'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { SkillList } from '@/components/admin/SkillList'
import { SkillForm } from '@/components/admin/SkillForm'
import { useSkillsQuery, useDeleteSkillMutation, useReorderSkillsMutation } from '@/feature/skill/query'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { AdminAddButton } from '@/components/admin/AdminAddButton'

export default function AdminSkillPage() {
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: skills = {}, isPending } = useSkillsQuery()
  const deleteMutation = useDeleteSkillMutation()
  const reorderMutation = useReorderSkillsMutation()

  const handleDelete = (id: number) => {
    if (!window.confirm('이 스킬을 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  const handleReorder = (updates: Array<{ id: number; sortOrder: number }>) => {
    reorderMutation.mutate(updates)
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
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <SkillList
        skills={skills}
        loading={isPending}
        onEdit={(id) => { setEditingId(id); document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }) }}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </div>
  )
}
