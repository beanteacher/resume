'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProjectList } from '@/components/admin/ProjectList'
import { ProjectForm } from '@/components/admin/ProjectForm'
import type { SerializedProject } from '@/types'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<SerializedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    void fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json() as { data: { items: SerializedProject[] } }
      setProjects(data.data?.items ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 프로젝트를 삭제하시겠습니까?')) return
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleFormSuccess = async () => {
    setEditingId(null)
    await fetchProjects()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">프로젝트 관리</h1>
        <Button variant="primary" onClick={() => setEditingId(0)}>
          + 프로젝트 추가
        </Button>
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
        loading={loading}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
