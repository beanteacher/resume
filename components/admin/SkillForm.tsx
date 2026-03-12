'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useSkillQuery, useCreateSkillMutation, useUpdateSkillMutation } from '@/feature/skill/query'
import type { SkillFormData } from '@/feature/skill/type'

interface SkillFormProps {
  skillId: number | null
  onSuccess: () => void
  onCancel: () => void
}

const defaultForm: SkillFormData = {
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
  const [formData, setFormData] = useState<SkillFormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: skill } = useSkillQuery(skillId)
  const createMutation = useCreateSkillMutation({ onSuccess })
  const updateMutation = useUpdateSkillMutation({ onSuccess })

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: String(skill.proficiency),
        iconUrl: skill.iconUrl ?? '',
        sortOrder: String(skill.sortOrder),
      })
    } else {
      setFormData(defaultForm)
    }
  }, [skill])

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = '스킬명은 필수입니다.'
    if (!formData.category) e.category = '카테고리를 선택하세요.'
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
      category: formData.category,
      proficiency: Number(formData.proficiency),
      iconUrl: formData.iconUrl || null,
      ...(skillId ? {} : { sortOrder: Number(formData.sortOrder) || 0 }),
    }

    if (skillId) {
      updateMutation.mutate({ id: skillId, ...input })
    } else {
      createMutation.mutate(input)
    }
  }

  const set = (field: keyof SkillFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const loading = createMutation.isPending || updateMutation.isPending
  const mutationError = createMutation.error?.message ?? updateMutation.error?.message

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
        {!skillId && (
          <Input type="number" label="정렬 순서" value={formData.sortOrder} onChange={set('sortOrder')} disabled={loading} min={0} helperText="0 입력 시 맨 앞에 추가됩니다." />
        )}
      </div>

      <Input label="아이콘 URL (선택)" placeholder="https://example.com/icon.svg" value={formData.iconUrl} onChange={set('iconUrl')} disabled={loading} />

      {mutationError && <p className="text-sm text-red-500">{mutationError}</p>}

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
