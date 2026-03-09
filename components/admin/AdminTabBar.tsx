'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const tabs = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/companies', label: '회사', icon: '🏢' },
  { href: '/admin/projects', label: '프로젝트', icon: '🛠️' },
  { href: '/admin/skills', label: '스킬', icon: '⚙️' },
]

export function AdminTabBar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="flex justify-around items-center h-full px-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
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
              <span className="text-xl">{tab.icon}</span>
              <span className="hidden xs:inline">{tab.label}</span>
            </span>
          </Link>
        )
      })}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-3 py-2 text-red-400 hover:text-red-500 transition-colors"
      >
        <span className="text-xl">🚪</span>
      </button>
    </div>
  )
}
