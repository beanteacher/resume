'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useProjectQuery, useCreateProjectMutation, useUpdateProjectMutation } from '@/feature/project/query'
import { useCompaniesQuery } from '@/feature/company/query'
import type { ProjectFormData } from '@/feature/project/type'

interface ProjectFormProps {
  projectId: number | null
  onSuccess: () => void
  onCancel: () => void
}

const defaultForm: ProjectFormData = {
  title: '',
  description: '',
  techStack: '',
  achievements: '',
  companyId: '',
  githubUrl: '',
  demoUrl: '',
  thumbnailUrl: '',
}

export function ProjectForm({ projectId, onSuccess, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: project } = useProjectQuery(projectId)
  const { data: companies = [] } = useCompaniesQuery()
  const createMutation = useCreateProjectMutation({ onSuccess })
  const updateMutation = useUpdateProjectMutation({ onSuccess })

  useEffect(() => {
    if (project) {
      const techArr = JSON.parse(project.techStack) as string[]
      const achArr = JSON.parse(project.achievements) as string[]
      setFormData({
        title: project.title,
        description: project.description,
        techStack: techArr.join(', '),
        achievements: achArr.join('\n'),
        companyId: project.companyId ? String(project.companyId) : '',
        githubUrl: project.githubUrl ?? '',
        demoUrl: project.demoUrl ?? '',
        thumbnailUrl: project.thumbnailUrl ?? '',
      })
    } else {
      setFormData(defaultForm)
    }
  }, [project])

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!formData.title.trim()) e.title = '프로젝트명은 필수입니다.'
    if (formData.description.trim().length < 10) e.description = '설명은 최소 10자 이상입니다.'
    if (!formData.techStack.trim()) e.techStack = '기술 스택은 최소 1개 이상 입력하세요.'
    if (!formData.achievements.trim()) e.achievements = '성과는 최소 1개 이상 입력하세요.'
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
      title: formData.title,
      description: formData.description,
      techStack: formData.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      achievements: formData.achievements.split('\n').map((s) => s.trim()).filter(Boolean),
      companyId: formData.companyId ? Number(formData.companyId) : null,
      githubUrl: formData.githubUrl || null,
      demoUrl: formData.demoUrl || null,
      thumbnailUrl: formData.thumbnailUrl || null,
    }

    if (projectId) {
      updateMutation.mutate({ id: projectId, ...input })
    } else {
      createMutation.mutate(input)
    }
  }

  const set = (field: keyof ProjectFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }))
  const loading = createMutation.isPending || updateMutation.isPending
  const mutationError = createMutation.error?.message ?? updateMutation.error?.message

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold text-[var(--text)]">
        {projectId ? '프로젝트 수정' : '프로젝트 추가'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="프로젝트명" value={formData.title} onChange={set('title')} error={errors.title} disabled={loading} />
        <Select
          label="연관 회사 (선택)"
          value={formData.companyId}
          onChange={set('companyId')}
          options={companyOptions}
          disabled={loading}
        />
      </div>

      <Input
        as="textarea"
        label="설명"
        value={formData.description}
        onChange={set('description')}
        error={errors.description}
        disabled={loading}
        rows={4}
        placeholder="프로젝트 개요와 역할을 설명하세요."
      />

      <Input
        label="기술 스택 (쉼표로 구분)"
        placeholder="React, Next.js, TypeScript"
        value={formData.techStack}
        onChange={set('techStack')}
        error={errors.techStack}
        disabled={loading}
        helperText="예: React, Next.js, TypeScript"
      />

      <Input
        as="textarea"
        label="성과 (줄바꿈으로 구분)"
        value={formData.achievements}
        onChange={set('achievements')}
        error={errors.achievements}
        disabled={loading}
        rows={4}
        placeholder="성과1&#10;성과2&#10;성과3"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="GitHub URL (선택)" placeholder="https://github.com/..." value={formData.githubUrl} onChange={set('githubUrl')} disabled={loading} />
        <Input label="데모 URL (선택)" placeholder="https://..." value={formData.demoUrl} onChange={set('demoUrl')} disabled={loading} />
      </div>

      <Input label="썸네일 URL (선택)" placeholder="https://example.com/thumbnail.png" value={formData.thumbnailUrl} onChange={set('thumbnailUrl')} disabled={loading} />

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
