'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { SkillsByCategory, ApiResponse } from '@/types'
import { Building2, Wrench, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AdminPageTitle } from '@/components/admin/AdminPageTitle'

const statItems: { key: 'companies' | 'projects' | 'skills'; label: string; href: string; icon: LucideIcon }[] = [
  { key: 'companies', label: '회사', href: '/admin/company', icon: Building2 },
  { key: 'projects', label: '프로젝트', href: '/admin/projects', icon: Wrench },
  { key: 'skills', label: '스킬', href: '/admin/skills', icon: Settings },
]

export default function AdminDashboardPage() {
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await fetch('/api/company')
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
      <AdminPageTitle title="대시보드" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {statItems.map((item) => (
          <Card key={item.key} hover className="flex flex-col justify-between">
            <div>
              <item.icon size={28} strokeWidth={1.5} className="mb-2 text-[var(--text-muted)]" />
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
    </div>
  )
}
