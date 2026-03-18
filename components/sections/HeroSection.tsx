'use client'

import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { useProfileQuery } from '@/feature/profile/query'

export function HeroSection() {
  const { data: profile, isPending } = useProfileQuery()
  const name = profile?.name
  const title = profile?.title
  const tagline = profile?.tagline

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[var(--text-muted)] text-[var(--font-size-body1)] mb-4 animate-[fade-up_0.6s_ease_both]"
           style={{animationDelay: '0s'}}>
          안녕하세요 👋
        </p>
        {isPending ? (
          <div className="h-6 w-96 mx-auto bg-[var(--elevated)] rounded animate-pulse mb-10" />
        ) : (
          <p className="text-[var(--font-size-body1)] text-[var(--text-muted)] mb-10 max-w-xl mx-auto animate-[fade-up_0.6s_ease_both]"
             style={{animationDelay: '0.24s'}}>
            {tagline}
          </p>
        )}
        {isPending ? (
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-48 bg-[var(--elevated)] rounded animate-pulse" />
            <div className="h-12 w-32 bg-[var(--elevated)] rounded animate-pulse" />
          </div>
        ) : (
          <h1 className="text-[var(--font-size-display)] font-[var(--font-weight-display)] leading-[var(--line-height-tight)] mb-6 animate-[fade-up_0.6s_ease_both]"
              style={{animationDelay: '0.08s'}}>
            {title}{' '}
            <span className="bg-gradient-to-r from-[var(--color-brand-purple)] via-[var(--color-brand-blue)] to-[var(--color-brand-cyan)] bg-clip-text text-transparent">
              {name}
            </span>
            입니다
          </h1>
        )}
        <div className="flex items-center justify-center gap-4 animate-[fade-up_0.6s_ease_both]"
             style={{animationDelay: '0.32s'}}>
          <a href="#projects"
             className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)] text-white font-medium rounded-[var(--radius-md)] hover:brightness-110 transition-all duration-[var(--transition-base)] shadow-[var(--shadow-glow)]">
            프로젝트 보기
          </a>
          <a href="#about"
             className="inline-flex items-center gap-2 px-8 py-3.5 border border-[var(--border-color)] text-[var(--text)] font-medium rounded-[var(--radius-md)] hover:bg-[var(--elevated)] transition-all duration-[var(--transition-base)]">
            더 알아보기
          </a>
        </div>
      </div>
      <div className="mt-16 animate-[fade-up_0.6s_ease_both]" style={{animationDelay: '0.4s'}}>
        <ScrollIndicator/>
      </div>
    </section>
  )
}
