'use client'

import { useProfileQuery } from '@/feature/profile/query'
import { AboutContent } from '@/components/sections/AboutContent'

export function AboutSection() {
  const { data: profile } = useProfileQuery()

  return (
    <AboutContent
      name={profile?.name ?? '오민성'}
      title={profile?.title ?? 'Backend Developer'}
      bio={profile?.bio ?? '데이터의 안정성과 품질 보장, 그리고 AI 협업으로 혼자서도 팀처럼 일합니다.'}
      email={profile?.email ?? null}
      github={profile?.github ?? 'https://github.com/beanteacher'}
      blog={profile?.blog ?? 'https://velog.io/@mings/posts'}
      avatarUrl={profile?.avatarUrl ?? null}
    />
  )
}
