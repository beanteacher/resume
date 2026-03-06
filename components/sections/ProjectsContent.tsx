'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { SerializedProject, ApiResponse } from '@/types'

function ProjectCard({ project, index }: { project: SerializedProject; index: number }) {
  let techTags: string[] = []
  try {
    techTags = JSON.parse(project.techStack) as string[]
  } catch {
    techTags = []
  }

  return (
    <div
      className="
        flex flex-col bg-[var(--surface)] border border-[var(--border-color)]
        rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)]
        hover:shadow-[var(--shadow-md)] hover:border-[var(--color-brand-purple)]/50 hover:-translate-y-1
        transition-all duration-[var(--transition-base)]
        animate-[fade-up_0.5s_ease_both]
      "
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/projects/${project.id}`}
          className="text-[var(--font-size-body1)] font-[var(--font-weight-subheading)] text-[var(--text)] hover:text-[var(--color-brand-purple)] transition-colors duration-[var(--transition-fast)] leading-snug"
        >
          {project.title}
        </Link>
        {project.company && (
          <span className="shrink-0 text-[var(--font-size-small)] text-[var(--text-muted)] bg-[var(--elevated)] px-2 py-0.5 rounded-full whitespace-nowrap">
            {project.company.name}
          </span>
        )}
      </div>

      {/* 설명 */}
      <p className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-relaxed mb-4 flex-1 line-clamp-3">
        {project.description}
      </p>

      {/* 기술 스택 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {techTags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="bg-[var(--elevated)] border border-[var(--border-color)] rounded-full px-2 py-0.5 text-xs text-[var(--text-muted)]"
          >
            {tag}
          </span>
        ))}
        {techTags.length > 5 && (
          <span className="bg-[var(--elevated)] border border-[var(--border-color)] rounded-full px-2 py-0.5 text-xs text-[var(--text-muted)]">
            +{techTags.length - 5}
          </span>
        )}
      </div>

      {/* 링크 */}
      <div className="flex items-center gap-4 mt-auto">
        <Link
          href={`/projects/${project.id}`}
          className="text-[var(--font-size-caption)] text-[var(--color-brand-purple)] hover:underline"
        >
          자세히 보기 →
        </Link>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--font-size-caption)] text-[var(--text-muted)] hover:text-[var(--color-brand-blue)] transition-colors"
          >
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--font-size-caption)] text-[var(--text-muted)] hover:text-[var(--color-brand-cyan)] transition-colors"
          >
            Demo
          </a>
        )}
      </div>
    </div>
  )
}

export function ProjectsContent({
  initialItems,
  initialCursor,
}: {
  initialItems: SerializedProject[]
  initialCursor: number | null
}) {
  const [items, setItems] = useState<SerializedProject[]>(initialItems)
  const [cursor, setCursor] = useState<number | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchMore = useCallback(async () => {
    if (!cursor || loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const res = await fetch(`/api/projects?cursor=${cursor}&limit=6`)
      const json = (await res.json()) as ApiResponse<{
        items: SerializedProject[]
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
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
