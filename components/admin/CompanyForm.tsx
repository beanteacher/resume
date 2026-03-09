'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { SerializedCompany } from '@/types'

interface CompanyFormProps {
  companyId: number | null
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  name: string
  role: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  logoUrl: string
}

const defaultForm: FormData = {
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  logoUrl: '',
}

export function CompanyForm({ companyId, onSuccess, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (companyId) {
      void fetchCompany(companyId)
    } else {
      setFormData(defaultForm)
    }
  }, [companyId])

  const fetchCompany = async (id: number) => {
    try {
      const res = await fetch(`/api/companies/${id}`)
      const data = await res.json() as { data: SerializedCompany }
      const c = data.data
      setFormData({
        name: c.name,
        role: c.role,
        startDate: c.startDate.split('T')[0],
        endDate: c.endDate ? c.endDate.split('T')[0] : '',
        isCurrent: c.isCurrent,
        description: c.description,
        logoUrl: c.logoUrl ?? '',
      })
    } catch (err) {
      console.error('회사 정보를 불러올 수 없습니다:', err)
    }
  }

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = '회사명은 필수입니다.'
    if (!formData.role.trim()) e.role = '직책은 필수입니다.'
    if (!formData.startDate) e.startDate = '시작일은 필수입니다.'
    if (!formData.isCurrent && !formData.endDate) e.endDate = '종료일은 필수입니다.'
    if (formData.description.trim().length < 10) e.description = '설명은 최소 10자 이상입니다.'
    return e
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      const method = companyId ? 'PUT' : 'POST'
      const url = companyId ? `/api/companies/${companyId}` : '/api/companies'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          startDate: formData.startDate,
          endDate: formData.isCurrent ? null : formData.endDate || null,
          isCurrent: formData.isCurrent,
          description: formData.description,
          logoUrl: formData.logoUrl || null,
        }),
      })
      if (!res.ok) throw new Error('저장 실패')
      onSuccess()
    } catch (err) {
      console.error(err)
      setErrors({ submit: '저장에 실패했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold text-[var(--text)]">
        {companyId ? '회사 수정' : '회사 추가'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="회사명" value={formData.name} onChange={set('name')} error={errors.name} disabled={loading} />
        <Input label="직책" value={formData.role} onChange={set('role')} error={errors.role} disabled={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="date" label="시작일" value={formData.startDate} onChange={set('startDate')} error={errors.startDate} disabled={loading} />
        <Input type="date" label="종료일" value={formData.endDate} onChange={set('endDate')} error={errors.endDate} disabled={loading || formData.isCurrent} />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isCurrent}
          onChange={(e) => setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))}
          disabled={loading}
          className="w-4 h-4 cursor-pointer"
        />
        <span className="text-sm font-medium text-[var(--text)]">현재 재직 중</span>
      </label>

      <Input
        as="textarea"
        label="설명"
        value={formData.description}
        onChange={set('description')}
        error={errors.description}
        disabled={loading}
        rows={4}
        placeholder="회사에서 담당한 역할과 업무를 설명하세요."
      />

      <Input
        label="로고 URL (선택)"
        placeholder="https://example.com/logo.png"
        value={formData.logoUrl}
        onChange={set('logoUrl')}
        disabled={loading}
      />

      {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? '저장 중...' : '저장'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          취소
        </Button>
      </div>
    </form>
  )
}
