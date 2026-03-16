'use client'

import type React from 'react'
import { useInView } from '@/lib/hooks/useInView'
import type { CompanyWithProjects } from '@/feature/company/type'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}.${m}`
}

function ExperienceCard({ company, index }: { company: CompanyWithProjects; index: number }) {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  const period = company.isCurrent
    ? `${formatDate(company.startDate)} ~ 현재`
    : `${formatDate(company.startDate)} ~ ${formatDate(company.endDate!)}`

  return (
    <div className="relative md:pl-12">
      {/* 타임라인 점 - desktop only */}
      <div className="hidden md:block absolute left-0 top-6 w-3 h-3 rounded-full bg-[var(--color-brand-purple)] ring-2 ring-[var(--bg)] -translate-x-1.5" />

      <div
        ref={ref as unknown as React.RefObject<HTMLDivElement>}
        className="
          bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-6
          shadow-[var(--shadow-sm)]
          hover:shadow-[var(--shadow-md)] hover:border-[var(--color-brand-purple)]/50 hover:-translate-y-1
          transition-[box-shadow,border-color,transform] duration-[var(--transition-base)]
        "
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s, box-shadow var(--transition-base), border-color var(--transition-base)`,
        }}
      >
        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-heading)] text-[var(--text)]">
              {company.name}
            </h3>
            <span className="inline-block bg-[var(--color-brand-purple)]/10 text-[var(--color-brand-purple)] rounded-full px-3 py-1 text-sm font-medium">
              {company.role}
            </span>
            {company.isCurrent && (
              <span className="inline-block bg-[var(--color-success,#10B981)]/10 text-[var(--color-success,#10B981)] rounded-full px-3 py-1 text-sm font-medium">
                재직 중
              </span>
            )}
          </div>
          <span className="text-sm text-[var(--text-muted)] shrink-0">{period}</span>
        </div>

        {/* 설명 */}
        <p className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-relaxed mb-3">
          {company.description}
        </p>

        {/* 담당 업무 */}
        {company.responsibilities && (
          <div className="mb-4">
            <p className="text-base font-semibold text-[var(--color-brand-purple)] mb-1">담당 업무</p>
            <p className="text-[var(--font-size-body2)] text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">
              {company.responsibilities}
            </p>
          </div>
        )}

        {/* 주요 성과 */}
        {company.achievements && (
          <div className="mb-4">
            <p className="text-base font-semibold text-[var(--color-brand-purple)] mb-1">주요 성과</p>
            <p className="text-[var(--font-size-body2)] text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">
              {company.achievements}
            </p>
          </div>
        )}

        {/* 참여 프로젝트 인라인 */}
        {company.projects.length > 0 && (
          <div className="mt-5 space-y-4">
            <p className="text-base font-semibold text-[var(--color-brand-purple)] uppercase tracking-wide">
              프로젝트
            </p>
            {company.projects.map((p) => {
              let techTags: string[] = []
              let achievements: string[] = []
              try { techTags = JSON.parse(p.techStack) as string[] } catch { techTags = [] }
              try { achievements = JSON.parse(p.achievements) as string[] } catch { achievements = [] }
              const fmtM = (d: string) => { const dt = new Date(d); return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,'0')}` }
              const period = p.startDate
                ? `${fmtM(p.startDate)} ~ ${p.endDate ? fmtM(p.endDate) : '진행 중'}`
                : null
              return (
                <div
                  key={p.id}
                  className="bg-[var(--elevated)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-5"
                >
                  {/* 프로젝트 제목 + 기간 */}
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                    <h4 className="text-[var(--font-size-body1)] font-[var(--font-weight-subheading)] text-[var(--text)]">
                      {p.title}
                    </h4>
                    {period && (
                      <span className="text-sm text-[var(--text-muted)] shrink-0">{period}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--color-brand-blue)] rounded-full px-3 py-1 text-sm transition-colors duration-[var(--transition-fast)]"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--color-brand-cyan)] rounded-full px-3 py-1 text-sm transition-colors duration-[var(--transition-fast)]"
                      >
                        Demo ↗
                      </a>
                    )}
                  </div>

                  {/* 설명 */}
                  <p className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-[var(--line-height-relaxed)] mb-4">
                    {p.description}
                  </p>

                  {/* 기술 스택 */}
                  {techTags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">기술 스택</p>
                      <div className="flex flex-wrap gap-1.5">
                        {techTags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-[var(--surface)] border border-[var(--border-color)] rounded-full px-3 py-1 text-sm text-[var(--text-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 주요 성과 */}
                  {achievements.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-muted)] mb-2">주요 성과</p>
                      <ul className="space-y-2">
                        {achievements.map((ach, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)] flex items-center justify-center text-white text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-[var(--line-height-relaxed)]">
                              {ach}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function ExperienceContent({ companies }: { companies: CompanyWithProjects[] }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {/* 세로줄 - desktop only */}
        <div className="hidden md:block absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[var(--color-brand-purple)] to-[var(--color-brand-cyan)]" />
        <div className="space-y-8">
          {companies.map((company, index) => (
            <ExperienceCard key={company.id} company={company} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
