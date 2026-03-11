'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import type { ApiResponse } from '@/types'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [profileName, setProfileName] = useState<string>('')

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/profile')
        const json = await res.json() as ApiResponse<{ name: string; [key: string]: unknown }>
        setProfileName(json.data?.name ?? '')
      } catch {
        setProfileName('')
      }
    })()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? '로그인에 실패했습니다.')
        return
      }

      router.push('/admin')
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-8">
          {profileName ? (
            <h1 className="text-2xl font-bold text-[var(--text)] mb-1">{profileName}</h1>
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
