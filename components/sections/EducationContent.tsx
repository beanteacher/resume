'use client'

import type React from 'react'
import { useInView } from '@/lib/hooks/useInView'
import type { SerializedEducation } from '@/types'

const TYPE_LABEL: Record<string, string> = {
  university: '학력',
  bootcamp: '교육',
  certificate: '수료',
}

const TYPE_COLOR: Record<string, string> = {
  university: 'var(--color-brand-blue)',
  bootcamp: 'var(--color-brand-purple)',
  certificate: 'var(--color-brand-cyan)',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}`
}

function EducationCard({ education, index }: { education: SerializedEducation; index: number }) {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  const period = education.isCurrent
    ? `${formatDate(education.startDate)} ~ 현재`
    : `${formatDate(education.startDate)} ~ ${formatDate(education.endDate!)}`

  const typeLabel = TYPE_LABEL[education.type] ?? education.type
  const typeColor = TYPE_COLOR[education.type] ?? 'var(--color-brand-purple)'

  return (
    <div className="relative md:pl-12">
      <div className="hidden md:block absolute left-0 top-6 w-3 h-3 rounded-full ring-2 ring-[var(--bg)] -translate-x-1.5"
        style={{ backgroundColor: typeColor }}
      />
      <div
        ref={ref as unknown as React.RefObject<HTMLDivElement>}
        className={`
          bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-6
          shadow-[var(--shadow-sm)]
          hover:shadow-[var(--shadow-md)] hover:border-[var(--color-brand-purple)]/50 hover:-translate-y-1
          transition-all duration-[var(--transition-base)]
          animate-[fade-up_0.5s_ease_both]
        `}
        style={{ animationDelay: `${index * 0.08}s`, opacity: isInView ? 1 : 0 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-heading)] text-[var(--text)]">
            {education.name}
          </h3>
          <span className="text-[var(--font-size-caption)] text-[var(--text-muted)]">{period}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className="inline-block rounded-full px-3 py-1 text-sm font-medium"
            style={{ backgroundColor: `color-mix(in srgb, ${typeColor} 12%, transparent)`, color: typeColor }}
          >
            {education.course}
          </span>
          <span
            className="inline-block rounded-full px-3 py-1 text-sm font-medium border"
            style={{ borderColor: `color-mix(in srgb, ${typeColor} 30%, transparent)`, color: typeColor }}
          >
            {typeLabel}
          </span>
          {education.isCurrent && (
            <span className="inline-block bg-[var(--color-success,#10B981)]/10 text-[var(--color-success,#10B981)] rounded-full px-3 py-1 text-sm font-medium">
              재학 중
            </span>
          )}
        </div>

        {education.description && (
          <p className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-relaxed">
            {education.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function EducationContent({ educations }: { educations: SerializedEducation[] }) {
  if (educations.length === 0) return null

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <h3 className="text-[var(--font-size-h3)] font-semibold text-[var(--text-muted)] mb-6 pl-0 md:pl-12">
        학력 / 교육
      </h3>
      <div className="relative">
        <div className="hidden md:block absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[var(--color-brand-blue)] to-[var(--color-brand-cyan)]" />
        <div className="space-y-8">
          {educations.map((edu, index) => (
            <EducationCard key={edu.id} education={edu} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
