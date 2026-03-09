'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTabBar } from '@/components/admin/AdminTabBar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* PC: 왼쪽 사이드바 */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col bg-[var(--surface)] border-r border-[var(--border-color)]">
        <AdminSidebar />
      </aside>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* 모바일: 하단 탭바 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--surface)] border-t border-[var(--border-color)] z-50">
        <AdminTabBar />
      </div>
    </div>
  )
}
