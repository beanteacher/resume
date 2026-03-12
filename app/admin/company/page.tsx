'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { CompanyList } from '@/components/admin/CompanyList'
import { CompanyForm } from '@/components/admin/CompanyForm'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
import { AdminAddButton } from '@/components/admin/AdminAddButton'
import { useCompaniesQuery, useDeleteCompanyMutation } from '@/feature/company/query'

export default function AdminCompanyPage() {
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data = [], isPending } = useCompaniesQuery()
  
  const deleteMutation = useDeleteCompanyMutation()

  const handleDelete = (id: number) => {
    if (!window.confirm('이 회사를 삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
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
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <CompanyList
        companies={data}
        loading={isPending}
        onEdit={(id) => setEditingId(id)}
        onDelete={handleDelete}
      />
    </div>
  )
}
