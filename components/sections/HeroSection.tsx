'use client'

import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { useProfileQuery } from '@/feature/profile/query'

export function HeroSection() {
  const { data: profile } = useProfileQuery()
  const name = profile?.name ?? '오민성'
  const title = profile?.title ?? 'Backend Developer'
  const tagline = profile?.tagline ?? '메시징 백엔드 전문 · Java/Spring Boot · AI 협업으로 혼자서도 팀처럼 일합니다.'

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[var(--text-muted)] text-[var(--font-size-body1)] mb-4 animate-[fade-up_0.6s_ease_both]" style={{ animationDelay: '0s' }}>
          안녕하세요 👋
        </p>
        <p className="text-[var(--font-size-h3)] text-[var(--text-muted)] mb-4 animate-[fade-up_0.6s_ease_both]" style={{ animationDelay: '0.16s' }}>
          {title}
        </p>
        <h1 className="text-[var(--font-size-display)] font-[var(--font-weight-display)] leading-[var(--line-height-tight)] mb-6 animate-[fade-up_0.6s_ease_both]" style={{ animationDelay: '0.08s' }}>
          <span className="bg-gradient-to-r from-[var(--color-brand-purple)] via-[var(--color-brand-blue)] to-[var(--color-brand-cyan)] bg-clip-text text-transparent">
            {name}
          </span>
          입니다
        </h1>
        <p className="text-[var(--font-size-body1)] text-[var(--text-muted)] mb-10 max-w-xl mx-auto animate-[fade-up_0.6s_ease_both]" style={{ animationDelay: '0.24s' }}>
          {tagline}
        </p>
        <div className="flex items-center justify-center gap-4 animate-[fade-up_0.6s_ease_both]" style={{ animationDelay: '0.32s' }}>
          <a href="#projects" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)] text-white font-medium rounded-[var(--radius-md)] hover:brightness-110 transition-all duration-[var(--transition-base)] shadow-[var(--shadow-glow)]">
            프로젝트 보기
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3.5 border border-[var(--border-color)] text-[var(--text)] font-medium rounded-[var(--radius-md)] hover:bg-[var(--elevated)] transition-all duration-[var(--transition-base)]">
            연락하기
          </a>
        </div>
      </div>
      <div className="mt-16 animate-[fade-up_0.6s_ease_both]" style={{ animationDelay: '0.4s' }}>
        <ScrollIndicator />
      </div>
    </section>
  )
}
