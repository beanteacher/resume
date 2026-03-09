'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SkillList } from '@/components/admin/SkillList'
import { SkillForm } from '@/components/admin/SkillForm'
import type { SkillsByCategory } from '@/types'

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillsByCategory>({})
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    void fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/skills')
      const data = await res.json() as { data: SkillsByCategory }
      setSkills(data.data ?? {})
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 스킬을 삭제하시겠습니까?')) return
    try {
      await fetch(`/api/skills/${id}`, { method: 'DELETE' })
      await fetchSkills()
    } catch (err) {
      console.error(err)
    }
  }

  const handleFormSuccess = async () => {
    setEditingId(null)
    await fetchSkills()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">스킬 관리</h1>
        <Button variant="primary" onClick={() => setEditingId(0)}>
          + 스킬 추가
        </Button>
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
        loading={loading}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
