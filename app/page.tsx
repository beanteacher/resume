import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { Layout } from '@/components/layout/Layout'
import { Section } from '@/components/sections/Section'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { AboutSection } from '@/components/sections/AboutSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { PhilosophyContent } from '@/components/sections/PhilosophyContent'

const getProfile = unstable_cache(
  async () => prisma.profile.findFirst(),
  ['profile-hero'],
  { tags: ['profile'] }
)

export default async function Home() {
  const profile = await getProfile()
  const name = profile?.name ?? '오민성'
  const title = profile?.title ?? 'Backend Developer'
  const bio = profile?.bio ?? '데이터의 안정성과 품질 보장, 그리고 AI 협업으로 혼자서도 팀처럼 일합니다.'

  return (
    <Layout>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-[var(--text-muted)] text-[var(--font-size-body1)] mb-4 animate-[fade-up_0.6s_ease_both]"
            style={{ animationDelay: '0s' }}
          >
            안녕하세요 👋
          </p>
          <h1
            className="text-[var(--font-size-display)] font-[var(--font-weight-display)] leading-[var(--line-height-tight)] mb-6 animate-[fade-up_0.6s_ease_both]"
            style={{ animationDelay: '0.08s' }}
          >
            <span className="bg-gradient-to-r from-[var(--color-brand-purple)] via-[var(--color-brand-blue)] to-[var(--color-brand-cyan)] bg-clip-text text-transparent">
              {name}
            </span>
            입니다
          </h1>
          <p
            className="text-[var(--font-size-h3)] text-[var(--text-muted)] mb-4 animate-[fade-up_0.6s_ease_both]"
            style={{ animationDelay: '0.16s' }}
          >
            {title}
          </p>
          <p
            className="text-[var(--font-size-body1)] text-[var(--text-muted)] mb-10 max-w-xl mx-auto animate-[fade-up_0.6s_ease_both]"
            style={{ animationDelay: '0.24s' }}
          >
            {bio}
          </p>
          <div
            className="flex items-center justify-center gap-4 animate-[fade-up_0.6s_ease_both]"
            style={{ animationDelay: '0.32s' }}
          >
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
        <div
          className="mt-16 animate-[fade-up_0.6s_ease_both]"
          style={{ animationDelay: '0.4s' }}
        >
          <ScrollIndicator />
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────── */}
      <Section id="about" title="About" subtitle="저에 대해 소개합니다">
        <AboutSection />
      </Section>

      {/* ── Philosophy ─────────────────────────────────────────── */}
      <Section id="philosophy" title="Philosophy" subtitle="AI 시대, 저는 이렇게 일합니다">
        <PhilosophyContent />
      </Section>

      {/* ── Experience ─────────────────────────────────────────── */}
      <Section id="experience" title="Experience" subtitle="경력 사항">
        <ExperienceSection />
        <EducationSection />
      </Section>

      {/* ── Skills ─────────────────────────────────────────────── */}
      <Section id="skills" title="Skills" subtitle="기술 스택">
        <SkillsSection />
      </Section>

      {/* ── Projects ───────────────────────────────────────────── */}
      <Section id="projects" title="Projects" subtitle="프로젝트">
        <ProjectsSection />
      </Section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <Section id="contact" title="Contact" subtitle="연락하기">
        <ContactSection />
      </Section>
    </Layout>
  )
}
