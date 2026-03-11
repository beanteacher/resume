'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CompanyList } from '@/components/admin/CompanyList'
import { CompanyForm } from '@/components/admin/CompanyForm'
import type { SerializedCompany, ApiResponse } from '@/types'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { AdminAddButton } from '@/components/admin/AdminAddButton'

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: companies = [], isPending } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await fetch('/api/companies')
      const json = await res.json() as ApiResponse<SerializedCompany[]>
      return json.data ?? []
    },
    placeholderData: (prev: SerializedCompany[] | undefined) => prev,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/companies/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
  })

  const handleDelete = (id: number) => {
    if (!window.confirm('이 회사를 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  const handleFormSuccess = () => {
    setEditingId(null)
    void queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <AdminPageTitle title="회사 관리" />
        <AdminAddButton label="회사" onClick={() => setEditingId(0)} />
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
        loading={isPending}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
