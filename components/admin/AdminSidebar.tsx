'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LayoutDashboard, Building2, GraduationCap, Wrench, Settings, LogOut, UserCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const menuItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/admin/profile', label: '프로필', icon: UserCircle },
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/companies', label: '회사', icon: Building2 },
  { href: '/admin/education', label: '학력/교육', icon: GraduationCap },
  { href: '/admin/projects', label: '프로젝트', icon: Wrench },
  { href: '/admin/skills', label: '스킬', icon: Settings },
]

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="flex flex-col h-full p-6">
      <Link href="/admin" className="mb-10">
        <h3 className="text-xl font-bold text-[var(--color-brand-purple)]">관리자</h3>
      </Link>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={`
                  flex items-center gap-3 w-full px-4 py-2.5 rounded-[var(--radius-md)]
                  text-sm font-medium
                  transition-colors duration-[var(--transition-fast)]
                  ${
                    isActive
                      ? 'bg-[var(--color-brand-purple)]/20 text-[var(--color-brand-purple)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]'
                  }
                `}
              >
                <Icon size={16} strokeWidth={1.75} />
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <Button
        variant="ghost"
        size="md"
        onClick={handleLogout}
        className="w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut size={16} strokeWidth={1.75} />
        로그아웃
      </Button>
    </div>
  )
}
