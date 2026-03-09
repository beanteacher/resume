'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { SerializedEducation } from '@/types'

interface EducationFormProps {
  educationId: number | null
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  name: string
  course: string
  type: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
}

const defaultForm: FormData = {
  name: '',
  course: '',
  type: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
}

const typeOptions = [
  { value: 'university', label: '대학교' },
  { value: 'bootcamp', label: '부트캠프 / 국비교육' },
  { value: 'certificate', label: '자격증 / 수료' },
]

export function EducationForm({ educationId, onSuccess, onCancel }: EducationFormProps) {
  const [formData, setFormData] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (educationId) {
      void fetchEducation(educationId)
    } else {
      setFormData(defaultForm)
    }
  }, [educationId])

  const fetchEducation = async (id: number) => {
    try {
      const res = await fetch(`/api/education/${id}`)
      const data = await res.json() as { data: SerializedEducation }
      const e = data.data
      setFormData({
        name: e.name,
        course: e.course,
        type: e.type,
        startDate: e.startDate.split('T')[0],
        endDate: e.endDate ? e.endDate.split('T')[0] : '',
        isCurrent: e.isCurrent,
        description: e.description ?? '',
      })
    } catch (err) {
      console.error(err)
    }
  }

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = '기관명은 필수입니다.'
    if (!formData.course.trim()) e.course = '전공/과정명은 필수입니다.'
    if (!formData.type) e.type = '유형을 선택하세요.'
    if (!formData.startDate) e.startDate = '시작일은 필수입니다.'
    if (!formData.isCurrent && !formData.endDate) e.endDate = '종료일은 필수입니다.'
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
      const method = educationId ? 'PUT' : 'POST'
      const url = educationId ? `/api/education/${educationId}` : '/api/education'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          course: formData.course,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.isCurrent ? null : formData.endDate || null,
          isCurrent: formData.isCurrent,
          description: formData.description || null,
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

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold text-[var(--text)]">
        {educationId ? '학력/교육 수정' : '학력/교육 추가'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="기관명" value={formData.name} onChange={set('name')} error={errors.name} disabled={loading} placeholder="서일대학교" />
        <Select label="유형" value={formData.type} onChange={set('type')} options={typeOptions} error={errors.type} disabled={loading} />
      </div>

      <Input label="전공 / 과정명" value={formData.course} onChange={set('course')} error={errors.course} disabled={loading} placeholder="컴퓨터 전자공학과" />

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
        <span className="text-sm font-medium text-[var(--text)]">재학 중 / 수강 중</span>
      </label>

      <Input
        as="textarea"
        label="설명 (선택)"
        value={formData.description}
        onChange={set('description')}
        disabled={loading}
        rows={3}
        placeholder="전공 내용, 수료 과정 등을 간략히 입력하세요."
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
