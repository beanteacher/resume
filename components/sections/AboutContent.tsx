'use client'

import { useInView } from '@/lib/hooks/useInView'

interface AboutContentProps {
  name: string
  title: string
  bio: string
  email: string | null
  github: string
  blog: string
  avatarUrl: string | null
}

export function AboutContent({ name, title, bio, email, github, blog, avatarUrl }: AboutContentProps) {
  const { ref, isInView } = useInView()

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="max-w-4xl mx-auto" 
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* 좌측: 아바타 + 텍스트 */}
        <div>
          {avatarUrl && (
            <img src={avatarUrl} alt={name} className="w-80 h-80 rounded-full object-cover border-2 border-[var(--border-color)] shadow-[var(--shadow-md)] mb-6"/>
          )}
          <h3 className="text-[var(--font-size-h2)] font-bold text-[var(--text)] mb-2">{name}</h3>
          <p className="text-[var(--color-brand-purple)] text-[var(--font-size-body1)] font-semibold mb-4">
            {title}
          </p>
          <p className="text-[var(--text-muted)] text-[var(--font-size-body1)] leading-[var(--line-height-relaxed)] whitespace-pre-wrap">
            {bio}
          </p>
        </div>

        {/* 우측: 소셜 링크 카드 */}
        <div className="flex flex-col gap-4">
          <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:border-[var(--color-brand-purple)]/50 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]">
            <span className="text-2xl">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--text)]" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.463-1.11-1.463-.907-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
              </svg>
            </span>
            <div>
              <p className="text-[var(--text)] font-semibold text-[var(--font-size-body2)]">GitHub</p>
              <p className="text-[var(--text-muted)] text-[var(--font-size-caption)]">{github}</p>
            </div>
          </a>

          <a href={blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:border-[var(--color-brand-blue)]/50 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]">
            <span className="text-2xl">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-brand-blue)]" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 14.93V15a1 1 0 0 0-2 0v1.93A8.003 8.003 0 0 1 4.07 11H5a1 1 0 0 0 0-2H4.07A8.003 8.003 0 0 1 11 4.07V5a1 1 0 0 0 2 0v-.93A8.003 8.003 0 0 1 19.93 11H19a1 1 0 0 0 0 2h.93A8.003 8.003 0 0 1 13 16.93z"/>
              </svg>
            </span>
            <div>
              <p className="text-[var(--text)] font-semibold text-[var(--font-size-body2)]">Blog</p>
              <p className="text-[var(--text-muted)] text-[var(--font-size-caption)]">{blog}</p>
            </div>
          </a>

          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] hover:border-[var(--color-brand-cyan)]/50 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] transition-all duration-[var(--transition-base)]">
              <span className="text-2xl">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand-cyan)]" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <div>
                <p className="text-[var(--text)] font-semibold text-[var(--font-size-body2)]">Email</p>
                <p className="text-[var(--text-muted)] text-[var(--font-size-caption)]">{email}</p>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
