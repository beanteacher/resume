import { prisma } from '@/lib/prisma'
import { AboutContent } from '@/components/sections/AboutContent'

export async function AboutSection() {
  const profile = await prisma.profile.findFirst()

  return (
    <AboutContent
      name={profile?.name ?? '오민성'}
      title={profile?.title ?? 'Backend Developer'}
      bio={profile?.bio ?? '데이터의 안정성과 품질 보장, 그리고 AI 협업으로 혼자서도 팀처럼 일합니다.'}
      email={profile?.email ?? null}
      github="https://github.com/beanteacher"
      blog="https://velog.io/@mings/posts"
    />
  )
}
