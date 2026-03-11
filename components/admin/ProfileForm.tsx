'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { ApiResponse } from '@/types'

interface ProfileData {
  id: number
  name: string
  title: string
  bio: string
  email: string
  phone: string | null
  location: string
  github: string
  linkedin: string | null
  blog: string | null
  avatarUrl: string | null
}

interface FormData {
  name: string
  title: string
  bio: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  blog: string
  avatarUrl: string
}

const defaultForm: FormData = {
  name: '',
  title: '',
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
  const [formData, setFormData] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    void fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile')
      const json = await res.json() as ApiResponse<ProfileData>
      const p = json.data
      setFormData({
        name: p.name,
        title: p.title,
        bio: p.bio,
        email: p.email,
        phone: p.phone ?? '',
        location: p.location,
        github: p.github,
        linkedin: p.linkedin ?? '',
        blog: p.blog ?? '',
        avatarUrl: p.avatarUrl ?? '',
      })
    } catch (err) {
      console.error('프로필 정보를 불러올 수 없습니다:', err)
    } finally {
      setFetching(false)
    }
  }

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
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          title: formData.title,
          bio: formData.bio,
          email: formData.email,
          phone: formData.phone || null,
          location: formData.location,
          github: formData.github,
          linkedin: formData.linkedin || null,
          blog: formData.blog || null,
          avatarUrl: formData.avatarUrl || null,
        }),
      })
      if (!res.ok) {
        const json = await res.json() as { error?: string }
        throw new Error(json.error ?? '저장에 실패했습니다.')
      }
      setSuccessMessage('저장되었습니다.')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setErrors({ submit: err instanceof Error ? err.message : '저장에 실패했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  if (fetching) {
    return <div className="animate-pulse h-96 rounded-[var(--radius-md)] bg-[var(--elevated)]" />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="이름" value={formData.name} onChange={set('name')} error={errors.name} disabled={loading} />
        <Input label="직함" value={formData.title} onChange={set('title')} error={errors.title} disabled={loading} placeholder="예: Backend Developer" />
      </div>

      <Input
        as="textarea"
        label="자기소개"
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

      {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
      {successMessage && <p className="text-sm text-green-500 font-medium">{successMessage}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  )
}
