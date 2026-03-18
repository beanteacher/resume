'use client'

import { useProfileQuery } from '@/feature/profile/query'
import { AboutContent } from '@/components/sections/AboutContent'

export function AboutSection() {
  const { data: profile, isPending } = useProfileQuery()

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 좌측 스켈레톤: 아바타 + 소셜 링크 */}
        <div className="flex flex-col items-center">
          <div className="w-80 h-80 rounded-full bg-[var(--elevated)] animate-pulse mb-6" />
          <div className="flex flex-col gap-4 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-[var(--radius-md)] bg-[var(--elevated)] animate-pulse" />
            ))}
          </div>
        </div>
        {/* 우측 스켈레톤: 이름/직함/bio */}
        <div className="flex flex-col justify-center gap-4">
          <div className="h-8 w-32 bg-[var(--elevated)] rounded animate-pulse" />
          <div className="h-5 w-48 bg-[var(--elevated)] rounded animate-pulse" />
          <div className="flex flex-col gap-2 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-[var(--elevated)] rounded animate-pulse" style={{ width: i % 3 === 2 ? '60%' : '100%' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AboutContent
      name={profile?.name ?? ''}
      title={profile?.title ?? ''}
      bio={profile?.bio ?? ''}
      email={profile?.email ?? null}
      phone={profile?.phone ?? null}
      github={profile?.github ?? ''}
      blog={profile?.blog ?? ''}
      avatarUrl={profile?.avatarUrl ?? null}
    />
  )
}
