'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

interface SkillFormProps {
  skillId: number | null
  onSuccess: () => void
  onCancel: () => void
}

interface Skill {
  id: number
  name: string
  category: string
  proficiency: number
  iconUrl: string | null
  sortOrder: number
}

interface FormData {
  name: string
  category: string
  proficiency: string
  iconUrl: string
  sortOrder: string
}

const defaultForm: FormData = {
  name: '',
  category: '',
  proficiency: '3',
  iconUrl: '',
  sortOrder: '0',
}

const categoryOptions = [
  { value: 'Frontend', label: 'Frontend' },
  { value: 'Backend', label: 'Backend' },
  { value: 'Database', label: 'Database' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Tool', label: 'Tool' },
]

const proficiencyOptions = [
  { value: 1, label: '★☆☆☆☆ (1)' },
  { value: 2, label: '★★☆☆☆ (2)' },
  { value: 3, label: '★★★☆☆ (3)' },
  { value: 4, label: '★★★★☆ (4)' },
  { value: 5, label: '★★★★★ (5)' },
]

export function SkillForm({ skillId, onSuccess, onCancel }: SkillFormProps) {
  const [formData, setFormData] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (skillId) {
      void fetchSkill(skillId)
    } else {
      setFormData(defaultForm)
    }
  }, [skillId])

  const fetchSkill = async (id: number) => {
    try {
      const res = await fetch(`/api/skills/${id}`)
      const data = await res.json() as { data: Skill }
      const s = data.data
      setFormData({
        name: s.name,
        category: s.category,
        proficiency: String(s.proficiency),
        iconUrl: s.iconUrl ?? '',
        sortOrder: String(s.sortOrder),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = '스킬명은 필수입니다.'
    if (!formData.category) e.category = '카테고리를 선택하세요.'
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
      const method = skillId ? 'PUT' : 'POST'
      const url = skillId ? `/api/skills/${skillId}` : '/api/skills'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          proficiency: Number(formData.proficiency),
          iconUrl: formData.iconUrl || null,
          sortOrder: Number(formData.sortOrder) || 0,
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

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold text-[var(--text)]">
        {skillId ? '스킬 수정' : '스킬 추가'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="스킬명" value={formData.name} onChange={set('name')} error={errors.name} disabled={loading} placeholder="React" />
        <Select label="카테고리" value={formData.category} onChange={set('category')} options={categoryOptions} error={errors.category} disabled={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="숙련도" value={formData.proficiency} onChange={set('proficiency')} options={proficiencyOptions} disabled={loading} />
        <Input type="number" label="정렬 순서" value={formData.sortOrder} onChange={set('sortOrder')} disabled={loading} min={0} helperText="숫자가 작을수록 앞에 표시됩니다." />
      </div>

      <Input label="아이콘 URL (선택)" placeholder="https://example.com/icon.svg" value={formData.iconUrl} onChange={set('iconUrl')} disabled={loading} />

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
