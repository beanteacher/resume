'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCompanyQuery, useCreateCompanyMutation, useUpdateCompanyMutation } from '@/feature/company/query'
import type { CompanyFormData } from '@/feature/company/type'

interface CompanyFormProps {
  companyId: number | null
  onSuccess: () => void
  onCancel: () => void
}

const defaultForm: CompanyFormData = {
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  responsibilities: '',
  achievements: '',
  logoUrl: '',
}

export function CompanyForm({ companyId, onSuccess, onCancel }: CompanyFormProps) {
  const [formData, setCompanyFormData] = useState<CompanyFormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: company } = useCompanyQuery(companyId)

  const createMutation = useCreateCompanyMutation({ onSuccess })
  const updateMutation = useUpdateCompanyMutation({ onSuccess })
  
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (company) {
      setCompanyFormData({
        name: company.name,
        role: company.role,
        startDate: company.startDate.split('T')[0],
        endDate: company.endDate ? company.endDate.split('T')[0] : '',
        isCurrent: company.isCurrent,
        description: company.description,
        responsibilities: company.responsibilities ?? '',
        achievements: company.achievements ?? '',
        logoUrl: company.logoUrl ?? '',
      })
    } else {
      setCompanyFormData(defaultForm)
    }
  }, [company])

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = '회사명은 필수입니다.'
    if (!formData.role.trim()) e.role = '직책은 필수입니다.'
    if (!formData.startDate) e.startDate = '시작일은 필수입니다.'
    if (!formData.isCurrent && !formData.endDate) e.endDate = '종료일은 필수입니다.'
    if (formData.description.trim().length < 10) e.description = '설명은 최소 10자 이상입니다.'
    return e
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    const input = {
      name: formData.name,
      role: formData.role,
      startDate: formData.startDate,
      endDate: formData.isCurrent ? null : formData.endDate || null,
      isCurrent: formData.isCurrent,
      description: formData.description,
      responsibilities: formData.responsibilities || null,
      achievements: formData.achievements || null,
      logoUrl: formData.logoUrl || null,
    }

    if (companyId) {
      updateMutation.mutate({ id: companyId, ...input })
    } else {
      createMutation.mutate(input)
    }
  }

  const mutationError = createMutation.error ?? updateMutation.error

  const set = (field: keyof CompanyFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setCompanyFormData((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold text-[var(--text)]">
        {companyId ? '회사 수정' : '회사 추가'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="회사명" value={formData.name} onChange={set('name')} error={errors.name} disabled={isPending} />
        <Input label="직책" value={formData.role} onChange={set('role')} error={errors.role} disabled={isPending} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="date" label="시작일" value={formData.startDate} onChange={set('startDate')} error={errors.startDate} disabled={isPending} />
        <Input type="date" label="종료일" value={formData.endDate} onChange={set('endDate')} error={errors.endDate} disabled={isPending || formData.isCurrent} />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isCurrent}
          onChange={(e) => setCompanyFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))}
          disabled={isPending}
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
        disabled={isPending}
        rows={4}
        placeholder="회사에 대한 간략한 설명을 입력하세요."
      />

      <Input
        as="textarea"
        label="담당 업무 (선택)"
        value={formData.responsibilities}
        onChange={set('responsibilities')}
        disabled={isPending}
        rows={4}
        placeholder={"담당 업무를 줄바꿈으로 구분하여 입력하세요.\n예) 백엔드 API 설계 및 개발\nCI/CD 파이프라인 구축"}
      />

      <Input
        as="textarea"
        label="주요 성과 (선택)"
        value={formData.achievements}
        onChange={set('achievements')}
        disabled={isPending}
        rows={4}
        placeholder={"주요 성과를 줄바꿈으로 구분하여 입력하세요.\n예) 응답 속도 40% 개선\n월간 활성 사용자 2만명 달성"}
      />

      <Input
        label="로고 URL (선택)"
        placeholder="https://example.com/logo.png"
        value={formData.logoUrl}
        onChange={set('logoUrl')}
        disabled={isPending}
      />

      {mutationError && (
        <p className="text-sm text-red-500">
          {mutationError instanceof Error ? mutationError.message : '저장에 실패했습니다.'}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          취소
        </Button>
      </div>
    </form>
  )
}
