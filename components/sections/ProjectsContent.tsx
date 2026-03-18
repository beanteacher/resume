'use client'

import Image from 'next/image'
import { useState } from 'react'
import type React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { CodeSnippetDto, ProjectDto } from '@/feature/project/type'
import { useInView } from '@/lib/hooks/useInView'

type ProjectCardData = {
  id: number
  title: string
  description: string
  techStack: string
  achievements: string
  startDate: string | null
  endDate: string | null
  thumbnailUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  codeSnippets?: CodeSnippetDto[]
}

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
  markdown: 'Markdown',
}

export function ProjectCard({ project, index }: { project: ProjectCardData; index: number }) {
  const { ref, isInView } = useInView({ threshold: 0.1 })
  const [codeOpen, setCodeOpen] = useState(false)

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
      {/* 썸네일 */}
      {project.thumbnailUrl && (
        <div className="mb-4 rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border-color)]">
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto max-h-72 object-contain"
          />
        </div>
      )}

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
            className="inline-flex items-center gap-2 bg-[var(--elevated)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--color-brand-purple)]/50 rounded-full px-3 py-1 text-sm transition-colors duration-[var(--transition-fast)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.463-1.11-1.463-.907-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
            </svg>
            GitHub
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
                <span className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-[var(--line-height-relaxed)] whitespace-pre-line">
                  {ach}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 코드 스니펫 */}
      {(project.codeSnippets?.length ?? 0) > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setCodeOpen((prev) => !prev)}
            className="flex items-center gap-2 text-[var(--font-size-caption)] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-[var(--transition-fast)] mb-3"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: codeOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            코드 예시 ({project.codeSnippets!.length})
          </button>

          {codeOpen && (
            <div className="space-y-4">
              {project.codeSnippets!.map((snippet) => (
                <div key={snippet.id} className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-color)]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[var(--border-color)]">
                    <span className="text-sm font-medium text-gray-200">{snippet.title}</span>
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                      {LANGUAGE_LABELS[snippet.language] ?? snippet.language}
                    </span>
                  </div>
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

    </div>
  )
}
