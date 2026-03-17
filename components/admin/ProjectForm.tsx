'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useProjectQuery, useCreateProjectMutation, useUpdateProjectMutation } from '@/feature/project/query'
import { useCompaniesQuery } from '@/feature/company/query'
import { useEducationsQuery } from '@/feature/education/query'
import type { ProjectFormData } from '@/feature/project/type'

interface ProjectFormProps {
  projectId: number | null
  onSuccess: () => void
  onCancel: () => void
}

type SnippetDraft = { title: string; language: string; code: string }

const LANGUAGES = [
  { value: 'java', label: 'Java' },
  { value: 'sql', label: 'SQL' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
]

const defaultForm: ProjectFormData = {
  title: '',
  description: '',
  techStack: '',
  achievements: '',
  startDate: '',
  endDate: '',
  companyId: '',
  educationId: '',
  githubUrl: '',
  demoUrl: '',
  thumbnailUrl: '',
}

const defaultSnippet: SnippetDraft = { title: '', language: 'java', code: '' }

export function ProjectForm({ projectId, onSuccess, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(defaultForm)
  const [snippets, setSnippets] = useState<SnippetDraft[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: project } = useProjectQuery(projectId)
  const { data: companies = [] } = useCompaniesQuery()
  const { data: educations = [] } = useEducationsQuery()
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
        startDate: project.startDate ? project.startDate.slice(0, 10) : '',
        endDate: project.endDate ? project.endDate.slice(0, 10) : '',
        companyId: project.companyId ? String(project.companyId) : '',
        educationId: project.educationId ? String(project.educationId) : '',
        githubUrl: project.githubUrl ?? '',
        demoUrl: project.demoUrl ?? '',
        thumbnailUrl: project.thumbnailUrl ?? '',
      })
      setSnippets(
        (project.codeSnippets ?? []).map((s) => ({
          title: s.title,
          language: s.language,
          code: s.code,
        }))
      )
    } else {
      setFormData(defaultForm)
      setSnippets([])
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
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      companyId: formData.companyId ? Number(formData.companyId) : null,
      educationId: formData.educationId ? Number(formData.educationId) : null,
      githubUrl: formData.githubUrl || null,
      demoUrl: formData.demoUrl || null,
      thumbnailUrl: formData.thumbnailUrl || null,
      codeSnippets: snippets
        .filter((s) => s.code.trim())
        .map((s, i) => ({ ...s, sortOrder: i })),
    }

    if (projectId) {
      updateMutation.mutate({ id: projectId, ...input })
    } else {
      createMutation.mutate(input)
    }
  }

  const set = (field: keyof ProjectFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const addSnippet = () => setSnippets((prev) => [...prev, { ...defaultSnippet }])

  const removeSnippet = (index: number) =>
    setSnippets((prev) => prev.filter((_, i) => i !== index))

  const updateSnippet = (index: number, field: keyof SnippetDraft, value: string) =>
    setSnippets((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))

  const companyOptions = companies.map((c) => ({ value: c.id, label: c.name }))
  const educationOptions = educations.map((e) => ({ value: e.id, label: e.name }))
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="연관 교육/학력 (선택)"
          value={formData.educationId}
          onChange={set('educationId')}
          options={educationOptions}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="시작일" type="date" value={formData.startDate} onChange={set('startDate')} disabled={loading} />
        <Input label="종료일 (선택)" type="date" value={formData.endDate} onChange={set('endDate')} disabled={loading} />
      </div>

      <Input
        as="textarea"
        label="설명"
        value={formData.description}
        onChange={set('description')}
        error={errors.description}
        disabled={loading}
        rows={10}
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

      {/* 코드 스니펫 섹션 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--text)]">코드 스니펫 (선택)</p>
          <Button type="button" size="sm" variant="cyan" onClick={addSnippet} disabled={loading}>
            + 추가
          </Button>
        </div>

        {snippets.map((snippet, index) => (
          <div
            key={index}
            className="border border-[var(--border-color)] rounded-[var(--radius-md)] p-4 space-y-3 bg-[var(--elevated)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)] font-medium">스니펫 #{index + 1}</span>
              <Button type="button" size="sm" variant="danger" onClick={() => removeSnippet(index)} disabled={loading}>
                삭제
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="제목"
                placeholder="예: Redis 조회 로직"
                value={snippet.title}
                onChange={(e) => updateSnippet(index, 'title', e.target.value)}
                disabled={loading}
              />
              <Select
                label="언어"
                value={snippet.language}
                onChange={(e) => updateSnippet(index, 'language', e.target.value)}
                options={LANGUAGES}
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--text-muted)]">코드</label>
              <textarea
                value={snippet.code}
                onChange={(e) => updateSnippet(index, 'code', e.target.value)}
                disabled={loading}
                rows={8}
                placeholder="코드를 입력하세요..."
                className="w-full rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text)] text-sm font-mono px-3 py-2 resize-y focus:outline-none focus:border-[var(--color-brand-blue)] disabled:opacity-50 placeholder:text-[var(--text-muted)] placeholder:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>

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
