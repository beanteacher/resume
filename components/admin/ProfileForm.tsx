'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useProfileQuery, useUpdateProfileMutation } from '@/feature/profile/query'
import type { ProfileFormData } from '@/feature/profile/type'

const defaultForm: ProfileFormData = {
  name: '',
  title: '',
  tagline: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  github: '',
  linkedin: '',
  blog: '',
  avatarUrl: '',
}

export function ProfileForm() {
  const [formData, setFormData] = useState<ProfileFormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  const { data: profile, isPending } = useProfileQuery()
  const updateMutation = useUpdateProfileMutation({
    onSuccess: () => {
      setSuccessMessage('저장되었습니다.')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        title: profile.title,
        tagline: profile.tagline ?? '',
        bio: profile.bio,
        email: profile.email,
        phone: profile.phone ?? '',
        location: profile.location,
        github: profile.github,
        linkedin: profile.linkedin ?? '',
        blog: profile.blog ?? '',
        avatarUrl: profile.avatarUrl ?? '',
      })
    }
  }, [profile])

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = '이름은 필수입니다.'
    if (!formData.title.trim()) e.title = '직함은 필수입니다.'
    if (formData.bio.trim().length < 10) e.bio = '자기소개는 최소 10자 이상입니다.'
    if (!formData.email.trim()) e.email = '이메일은 필수입니다.'
    if (!formData.location.trim()) e.location = '위치는 필수입니다.'
    if (!formData.github.trim()) e.github = 'GitHub URL은 필수입니다.'
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
    updateMutation.mutate({
      name: formData.name,
      title: formData.title,
      tagline: formData.tagline || undefined,
      bio: formData.bio,
      email: formData.email,
      phone: formData.phone || undefined,
      location: formData.location,
      github: formData.github,
      linkedin: formData.linkedin || undefined,
      blog: formData.blog || undefined,
      avatarUrl: formData.avatarUrl || undefined,
    })
  }

  const set = (field: keyof ProfileFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  if (isPending) {
    return <div className="animate-pulse h-96 rounded-[var(--radius-md)] bg-[var(--elevated)]" />
  }

  const loading = updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="이름" value={formData.name} onChange={set('name')} error={errors.name} disabled={loading} />
        <Input label="직함" value={formData.title} onChange={set('title')} error={errors.title} disabled={loading} placeholder="예: Backend Developer" />
      </div>

      <Input
        label="Hero 한 줄 소개 (선택)"
        value={formData.tagline}
        onChange={set('tagline')}
        disabled={loading}
        placeholder="예: 메시징 백엔드 전문 · Java/Spring Boot · AI 협업 개발자"
      />

      <Input
        as="textarea"
        label="자기소개 (About 섹션)"
        value={formData.bio}
        onChange={set('bio')}
        error={errors.bio}
        disabled={loading}
        rows={4}
        placeholder="자신을 소개하는 문장을 입력하세요. (최소 10자)"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="email" label="이메일" value={formData.email} onChange={set('email')} error={errors.email} disabled={loading} />
        <Input label="전화번호 (선택)" value={formData.phone} onChange={set('phone')} disabled={loading} placeholder="010-0000-0000" />
      </div>

      <Input label="위치" value={formData.location} onChange={set('location')} error={errors.location} disabled={loading} placeholder="예: Seoul, Korea" />

      <Input type="url" label="GitHub URL" value={formData.github} onChange={set('github')} error={errors.github} disabled={loading} placeholder="https://github.com/username" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="url" label="LinkedIn URL (선택)" value={formData.linkedin} onChange={set('linkedin')} disabled={loading} placeholder="https://linkedin.com/in/username" />
        <Input type="url" label="블로그 URL (선택)" value={formData.blog} onChange={set('blog')} disabled={loading} placeholder="https://velog.io/@username" />
      </div>

      <Input type="url" label="프로필 이미지 URL (선택)" value={formData.avatarUrl} onChange={set('avatarUrl')} disabled={loading} placeholder="https://example.com/avatar.png" />

      {updateMutation.isError && <p className="text-sm text-red-500">{updateMutation.error.message}</p>}
      {successMessage && <p className="text-sm text-green-500 font-medium">{successMessage}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  )
}
