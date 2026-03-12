'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, GraduationCap, Wrench, Settings, LogOut, UserCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLogoutMutation } from '@/feature/auth/query'

const tabs: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/admin/profile', label: '프로필', icon: UserCircle },
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/company', label: '회사', icon: Building2 },
  { href: '/admin/education', label: '학력', icon: GraduationCap },
  { href: '/admin/project', label: '프로젝트', icon: Wrench },
  { href: '/admin/skill', label: '스킬', icon: Settings },
]

export function AdminTabBar() {
  const pathname = usePathname()
  const router = useRouter()

  const logoutMutation = useLogoutMutation({
    onSuccess: () => router.push('/admin/login'),
  })

  const handleLogout = () => logoutMutation.mutate()

  return (
    <div className="flex justify-around items-center h-full px-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        const Icon = tab.icon
        return (
          <Link key={tab.href} href={tab.href}>
            <span
              className={`
                flex flex-col items-center gap-1 px-3 py-2
                text-xs font-medium
                transition-colors duration-[var(--transition-fast)]
                ${isActive ? 'text-[var(--color-brand-purple)]' : 'text-[var(--text-muted)]'}
              `}
            >
              <Icon size={20} strokeWidth={1.75} />
              <span className="hidden xs:inline">{tab.label}</span>
            </span>
          </Link>
        )
      })}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-3 py-2 text-red-400 hover:text-red-500 transition-colors"
      >
        <LogOut size={20} strokeWidth={1.75} />
      </button>
    </div>
  )
}
