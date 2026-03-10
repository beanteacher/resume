import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

type Params = { id: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id: Number(id) } })
  if (!project) return { title: '프로젝트를 찾을 수 없습니다' }
  return {
    title: `${project.title} — 오민성`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: `${project.title} — 오민성`,
      description: project.description.slice(0, 160),
    },
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: { company: true },
  })

  if (!project) notFound()

  let techTags: string[] = []
  let achievements: string[] = []
  try {
    techTags = JSON.parse(project.techStack) as string[]
    achievements = JSON.parse(project.achievements) as string[]
  } catch {
    techTags = []
    achievements = []
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] pt-24 pb-16 px-6 animate-[fade-in_0.4s_ease_both]">
      <article className="max-w-3xl mx-auto">
        {/* 뒤로 가기 */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-[var(--text-muted)] text-[var(--font-size-caption)] hover:text-[var(--color-brand-purple)] transition-colors duration-[var(--transition-fast)] mb-8"
        >
          ← 프로젝트 목록
        </Link>

        {/* 제목 */}
        <h1
          className="text-[var(--font-size-h1)] font-[var(--font-weight-heading)] text-[var(--text)] mb-4 leading-[var(--line-height-snug)] animate-[fade-up_0.5s_ease_both]"
        >
          {project.title}
        </h1>

        {/* 메타 뱃지 */}
        <div
          className="flex flex-wrap gap-2 mb-8 animate-[fade-up_0.5s_ease_both]"
          style={{ animationDelay: '0.08s' }}
        >
          {project.company && (
            <span className="inline-block bg-[var(--color-brand-purple)]/10 text-[var(--color-brand-purple)] rounded-full px-3 py-1 text-sm font-medium">
              {project.company.name}
            </span>
          )}
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
        <section
          className="mb-10 animate-[fade-up_0.5s_ease_both]"
          style={{ animationDelay: '0.12s' }}
        >
          <p className="text-[var(--text-muted)] text-[var(--font-size-body1)] leading-[var(--line-height-relaxed)]">
            {project.description}
          </p>
        </section>

        {/* 기술 스택 */}
        {techTags.length > 0 && (
          <section
            className="mb-10 animate-[fade-up_0.5s_ease_both]"
            style={{ animationDelay: '0.16s' }}
          >
            <h2 className="text-[var(--font-size-h3)] font-[var(--font-weight-heading)] text-[var(--text)] mb-4">
              기술 스택
            </h2>
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
          </section>
        )}

        {/* 주요 성과 */}
        {achievements.length > 0 && (
          <section
            className="animate-[fade-up_0.5s_ease_both]"
            style={{ animationDelay: '0.2s' }}
          >
            <h2 className="text-[var(--font-size-h3)] font-[var(--font-weight-heading)] text-[var(--text)] mb-4">
              주요 성과
            </h2>
            <ul className="space-y-4">
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
          </section>
        )}
      </article>
    </main>
  )
}
