import { Layout } from '@/components/layout/Layout'
import { Section } from '@/components/sections/Section'

export default function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center animate-[fade-up_0.6s_ease_both]">
          <p className="text-[var(--text-muted)] text-[var(--font-size-body1)] mb-4">
            안녕하세요 👋
          </p>
          <h1 className="text-[var(--font-size-display)] font-[var(--font-weight-display)] leading-[var(--line-height-tight)] mb-6">
            <span className="bg-gradient-to-r from-[var(--color-brand-purple)] via-[var(--color-brand-blue)] to-[var(--color-brand-cyan)] bg-clip-text text-transparent">
              김개발
            </span>
            입니다
          </h1>
          <p className="text-[var(--font-size-h3)] text-[var(--text-muted)] mb-10">
            Full Stack Developer
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-blue)] text-white font-medium rounded-[var(--radius-md)] hover:brightness-110 transition-all duration-[var(--transition-base)] shadow-[var(--shadow-glow)]"
            >
              프로젝트 보기
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[var(--border-color)] text-[var(--text)] font-medium rounded-[var(--radius-md)] hover:bg-[var(--elevated)] transition-all duration-[var(--transition-base)]"
            >
              연락하기
            </a>
          </div>
        </div>
      </section>

      <Section id="about" title="About" subtitle="저에 대해 소개합니다">
        <p className="text-center text-[var(--text-muted)]">Coming in Sprint 2</p>
      </Section>

      <Section id="experience" title="Experience" subtitle="경력 사항">
        <p className="text-center text-[var(--text-muted)]">Coming in Sprint 2</p>
      </Section>

      <Section id="skills" title="Skills" subtitle="기술 스택">
        <p className="text-center text-[var(--text-muted)]">Coming in Sprint 2</p>
      </Section>

      <Section id="projects" title="Projects" subtitle="프로젝트">
        <p className="text-center text-[var(--text-muted)]">Coming in Sprint 2</p>
      </Section>

      <Section id="contact" title="Contact" subtitle="연락처">
        <p className="text-center text-[var(--text-muted)]">Coming in Sprint 2</p>
      </Section>
    </Layout>
  )
}
