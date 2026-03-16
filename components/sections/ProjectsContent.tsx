'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ApiResponse } from '@/types'
import type { ProjectDto } from '@/feature/project/type'
import { useInView } from '@/lib/hooks/useInView'

function ProjectCard({ project, index }: { project: ProjectDto; index: number }) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  let techTags: string[] = []
  let achievements: string[] = []
  try { techTags = JSON.parse(project.techStack) as string[] } catch { techTags = [] }
  try { achievements = JSON.parse(project.achievements) as string[] } catch { achievements = [] }
  const fmtM = (d: string) => { const dt = new Date(d); return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,'0')}` }
  const period = project.startDate
    ? `${fmtM(project.startDate)} ~ ${project.endDate ? fmtM(project.endDate) : '진행 중'}`
    : null

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="
        bg-[var(--surface)] border border-[var(--border-color)]
        rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)]
      "
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${(index % 6) * 0.08}s, transform 0.6s ease ${(index % 6) * 0.08}s`,
      }}
    >
      {/* 제목 + 기간 */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h3 className="text-[var(--font-size-h3)] font-[var(--font-weight-heading)] text-[var(--text)]">
          {project.title}
        </h3>
        {period && (
          <span className="text-[var(--font-size-caption)] text-[var(--text-muted)] shrink-0">{period}</span>
        )}
      </div>

      {/* 링크 뱃지 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-[var(--elevated)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--color-brand-blue)] rounded-full px-3 py-1 text-sm transition-colors duration-[var(--transition-fast)]"
          >
            GitHub ↗
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-[var(--elevated)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--color-brand-cyan)] rounded-full px-3 py-1 text-sm transition-colors duration-[var(--transition-fast)]"
          >
            Demo ↗
          </a>
        )}
      </div>

      {/* 설명 */}
      <p className="text-[var(--text-muted)] text-[var(--font-size-body1)] leading-[var(--line-height-relaxed)] mb-6">
        {project.description}
      </p>

      {/* 기술 스택 */}
      {techTags.length > 0 && (
        <div className="mb-6">
          <p className="text-[var(--font-size-caption)] font-semibold text-[var(--text-muted)] mb-2">기술 스택</p>
          <div className="flex flex-wrap gap-2">
            {techTags.map((tag) => (
              <span
                key={tag}
                className="bg-[var(--elevated)] border border-[var(--border-color)] rounded-full px-3 py-1 text-sm text-[var(--text-muted)]"
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
          <p className="text-[var(--font-size-caption)] font-semibold text-[var(--text-muted)] mb-2">주요 성과</p>
          <ul className="space-y-3">
            {achievements.map((ach, i) => (
              <li key={i} className="flex items-start gap-3">
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
}

export function ProjectsContent({
  initialItems,
  initialCursor,
}: {
  initialItems: ProjectDto[]
  initialCursor: number | null
}) {
  const [items, setItems] = useState<ProjectDto[]>(initialItems)
  const [cursor, setCursor] = useState<number | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchMore = useCallback(async () => {
    if (!cursor || loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const res = await fetch(`/api/project?cursor=${cursor}&limit=6&standalone=true`)
      const json = (await res.json()) as ApiResponse<{
        items: ProjectDto[]
        nextCursor: number | null
      }>
      setItems((prev) => [...prev, ...json.data.items])
      setCursor(json.data.nextCursor)
    } catch {
      // silent fail
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [cursor])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !cursor) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchMore()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchMore, cursor])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {items.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* 무한 스크롤 sentinel */}
      <div ref={sentinelRef} className="h-8 mt-4" />

      {loading && (
        <p className="text-center text-[var(--text-muted)] text-[var(--font-size-caption)] py-4">
          불러오는 중...
        </p>
      )}

      {!cursor && !loading && items.length > 0 && (
        <p className="text-center text-[var(--text-muted)] text-[var(--font-size-caption)] py-4">
          전체 {items.length}개 프로젝트
        </p>
      )}
    </div>
  )
}
