'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CompanyList } from '@/components/admin/CompanyList'
import { CompanyForm } from '@/components/admin/CompanyForm'
import type { SerializedCompany } from '@/types'

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<SerializedCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null) // null=폼닫힘, 0=신규, n=수정

  useEffect(() => {
    void fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/companies')
      const data = await res.json() as { data: SerializedCompany[] }
      setCompanies(data.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 회사를 삭제하시겠습니까?')) return
    try {
      await fetch(`/api/companies/${id}`, { method: 'DELETE' })
      setCompanies((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleFormSuccess = async () => {
    setEditingId(null)
    await fetchCompanies()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">회사 관리</h1>
        <Button variant="primary" onClick={() => setEditingId(0)}>
          + 회사 추가
        </Button>
      </div>

      {editingId !== null && (
        <Card className="mb-6">
          <CompanyForm
            companyId={editingId === 0 ? null : editingId}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <CompanyList
        companies={companies}
        loading={loading}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
