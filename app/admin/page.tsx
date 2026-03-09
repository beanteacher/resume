'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { SkillsByCategory, ApiResponse } from '@/types'

const statItems = [
  { key: 'companies' as const, label: '회사', href: '/admin/companies', icon: '🏢' },
  { key: 'projects' as const, label: '프로젝트', href: '/admin/projects', icon: '🛠️' },
  { key: 'skills' as const, label: '스킬', href: '/admin/skills', icon: '⚙️' },
]

export default function AdminDashboardPage() {
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await fetch('/api/companies')
      const json = await res.json() as ApiResponse<unknown[]>
      return json.data ?? []
    },
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects')
      const json = await res.json() as ApiResponse<{ items: unknown[] }>
      return json.data?.items ?? []
    },
  })

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await fetch('/api/skills')
      const json = await res.json() as ApiResponse<SkillsByCategory>
      return json.data ?? {}
    },
  })

  const counts = {
    companies: companies?.length,
    projects: projects?.length,
    skills: skills ? Object.values(skills).flat().length : undefined,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-8">대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {statItems.map((item) => (
          <Card key={item.key} hover className="flex flex-col justify-between">
            <div>
              <p className="text-3xl mb-2">{item.icon}</p>
              <p className="text-sm text-[var(--text-muted)] font-medium mb-1">{item.label}</p>
              <p className="text-4xl font-bold text-[var(--color-brand-purple)]">
                {counts[item.key] ?? '—'}
              </p>
            </div>
            <Link href={item.href} className="mt-4 block">
              <Button variant="ghost" size="sm" className="w-full">
                관리 →
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-base font-semibold text-[var(--text)] mb-4">빠른 접근</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/admin/companies">
            <Button variant="secondary" className="w-full justify-start gap-2">
              🏢 회사 관리
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="secondary" className="w-full justify-start gap-2">
              🛠️ 프로젝트 관리
            </Button>
          </Link>
          <Link href="/admin/skills">
            <Button variant="secondary" className="w-full justify-start gap-2">
              ⚙️ 스킬 관리
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
