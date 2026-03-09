'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EducationList } from '@/components/admin/EducationList'
import { EducationForm } from '@/components/admin/EducationForm'
import type { SerializedEducation } from '@/types'

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<SerializedEducation[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    void fetchEducations()
  }, [])

  const fetchEducations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/education')
      const data = await res.json() as { data: SerializedEducation[] }
      setEducations(data.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 항목을 삭제하시겠습니까?')) return
    try {
      await fetch(`/api/education/${id}`, { method: 'DELETE' })
      setEducations((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleFormSuccess = async () => {
    setEditingId(null)
    await fetchEducations()
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
        loading={loading}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
