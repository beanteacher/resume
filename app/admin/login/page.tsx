'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useLoginMutation } from '@/feature/auth/query'
import { useProfileQuery } from '@/feature/profile/query'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { data: profile } = useProfileQuery()

  const loginMutation = useLoginMutation({
    onSuccess: () => router.push('/admin'),
    onError: (err) => setError(err.message),
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate(password)
  }

  const loading = loginMutation.isPending

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-8">
          {profile ? (
            <h1 className="text-2xl font-bold text-[var(--text)] mb-1">{profile.name}</h1>
          ) : (
            <div className="h-8 w-24 mx-auto mb-1 rounded bg-[var(--surface)] animate-pulse" />
          )}
          <p className="text-[var(--color-brand-purple)] font-semibold">Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="password"
            type="password"
            label="비밀번호"
            placeholder="관리자 비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
