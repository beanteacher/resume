'use client'

import type React from 'react'
import { useInView } from '@/lib/hooks/useInView'
import type { CompanyWithProjects } from '@/types'

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

  let techTags: string[] = []
  try {
    const firstProject = company.projects[0]
    if (firstProject) techTags = JSON.parse(firstProject.techStack) as string[]
  } catch {
    techTags = []
  }

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
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-heading)] text-[var(--text)]">
            {company.name}
          </h3>
          <span className="text-[var(--font-size-caption)] text-[var(--text-muted)]">{period}</span>
        </div>

        {/* 뱃지 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block bg-[var(--color-brand-purple)]/10 text-[var(--color-brand-purple)] rounded-full px-3 py-1 text-sm font-medium">
            {company.role}
          </span>
          {company.isCurrent && (
            <span className="inline-block bg-[var(--color-success,#10B981)]/10 text-[var(--color-success,#10B981)] rounded-full px-3 py-1 text-sm font-medium">
              재직 중
            </span>
          )}
        </div>

        {/* 설명 */}
        <p className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-relaxed mb-4">
          {company.description}
        </p>

        {/* 참여 프로젝트 */}
        {company.projects.length > 0 && (
          <div className="mb-4">
            <p className="text-[var(--font-size-caption)] font-semibold text-[var(--text-muted)] mb-2">
              참여 프로젝트
            </p>
            <ul className="space-y-1">
              {company.projects.map((p) => (
                <li key={p.id}>
                  <a
                    href={`/projects/${p.id}`}
                    className="text-[var(--font-size-caption)] text-[var(--color-brand-blue)] hover:underline"
                  >
                    {p.title}
                    {p.description && (
                      <span className="text-[var(--text-muted)] ml-1">
                        — {p.description.length > 60 ? `${p.description.slice(0, 60)}…` : p.description}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 기술 스택 태그 */}
        {techTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techTags.map((tag) => (
              <span
                key={tag}
                className="bg-[var(--elevated)] border border-[var(--border-color)] rounded-full px-2 py-0.5 text-xs text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
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
