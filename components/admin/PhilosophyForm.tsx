'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { usePhilosophyQuery, useCreatePhilosophyMutation, useUpdatePhilosophyMutation } from '@/feature/philosophy/query'
import type { PhilosophyFormData } from '@/feature/philosophy/type'

interface PhilosophyFormProps {
  philosophyId: number | null
  onSuccess: () => void
  onCancel: () => void
}

const defaultForm: PhilosophyFormData = {
  icon: '',
  title: '',
  desc: '',
}

export function PhilosophyForm({ philosophyId, onSuccess, onCancel }: PhilosophyFormProps) {
  const [formData, setFormData] = useState<PhilosophyFormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: philosophy } = usePhilosophyQuery(philosophyId)
  const createMutation = useCreatePhilosophyMutation({ onSuccess })
  const updateMutation = useUpdatePhilosophyMutation({ onSuccess })

  useEffect(() => {
    if (philosophy) {
      setFormData({ icon: philosophy.icon, title: philosophy.title, desc: philosophy.desc })
    } else {
      setFormData(defaultForm)
    }
  }, [philosophy])

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!formData.icon.trim()) e.icon = '아이콘(이모지)은 필수입니다.'
    if (!formData.title.trim()) e.title = '제목은 필수입니다.'
    if (!formData.desc.trim()) e.desc = '설명은 필수입니다.'
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
    const input = { icon: formData.icon, title: formData.title, desc: formData.desc }
    if (philosophyId) {
      updateMutation.mutate({ id: philosophyId, ...input })
    } else {
      createMutation.mutate(input)
    }
  }

  const set = (field: keyof PhilosophyFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const loading = createMutation.isPending || updateMutation.isPending
  const mutationError = createMutation.error?.message ?? updateMutation.error?.message

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold text-[var(--text)]">
        {philosophyId ? '가치관 수정' : '가치관 추가'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="아이콘 (이모지)"
          value={formData.icon}
          onChange={set('icon')}
          error={errors.icon}
          disabled={loading}
          placeholder="🤖"
        />
        <Input
          label="제목"
          value={formData.title}
          onChange={set('title')}
          error={errors.title}
          disabled={loading}
          placeholder="AI를 팀원으로"
        />
      </div>

      <Input
        as="textarea"
        label="설명"
        value={formData.desc}
        onChange={set('desc')}
        error={errors.desc}
        disabled={loading}
        rows={3}
        placeholder="가치관에 대한 설명을 입력하세요."
      />

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
