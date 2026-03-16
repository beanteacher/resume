'use client'

import type React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { ProjectDto } from '@/feature/project/type'
import { useInView } from '@/lib/hooks/useInView'

const LANGUAGE_LABELS: Record<string, string> = {
  java: 'Java',
  sql: 'SQL',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  bash: 'Bash',
  json: 'JSON',
  xml: 'XML',
  yaml: 'YAML',
}

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
      <p className="text-[var(--text-muted)] text-[var(--font-size-body1)] leading-[var(--line-height-relaxed)] mb-6 whitespace-pre-wrap">
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
        <div className="mb-6">
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

      {/* 코드 스니펫 */}
      {project.codeSnippets?.length > 0 && (
        <div className="space-y-4">
          <p className="text-[var(--font-size-caption)] font-semibold text-[var(--text-muted)]">코드 예시</p>
          {project.codeSnippets.map((snippet) => (
            <div key={snippet.id} className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-color)]">
              {/* 헤더 */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[var(--border-color)]">
                <span className="text-sm font-medium text-gray-200">{snippet.title}</span>
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                  {LANGUAGE_LABELS[snippet.language] ?? snippet.language}
                </span>
              </div>
              {/* 코드 */}
              <SyntaxHighlighter
                language={snippet.language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.8rem' }}
                showLineNumbers
              >
                {snippet.code}
              </SyntaxHighlighter>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectsContent({ projects }: { projects: ProjectDto[] }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {projects.length > 0 && (
        <p className="text-center text-[var(--text-muted)] text-[var(--font-size-caption)] py-4">
          전체 {projects.length}개 프로젝트
        </p>
      )}
    </div>
  )
}
