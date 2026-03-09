import { Layout } from '@/components/layout/Layout'
import { Section } from '@/components/sections/Section'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { AboutSection } from '@/components/sections/AboutSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ContactSection } from '@/components/sections/ContactSection'

const PHILOSOPHY_ITEMS = [
  {
    icon: '🤖',
    title: 'AI를 팀원으로',
    desc: 'AI에게 PM·FE·BE·UI/UX 페르소나를 부여하고 AGENTS.md로 역할을 정의합니다. 혼자 일하지만 팀처럼 협업합니다.',
  },
  {
    icon: '📋',
    title: '컨텍스트 엔지니어링',
    desc: 'MEMORY.md·Sprint Plan·WBS를 직접 작성해 AI와의 대화 품질을 체계적으로 관리합니다. 다음 세션에서도 맥락이 유지됩니다.',
  },
  {
    icon: '🚀',
    title: 'DRI 문화 — 혼자서도 전체를',
    desc: '3인 팀 → 1인 전환 후 OAM 시스템을 단독 완수한 경험. AI 협업이 솔로 개발의 한계를 허뭅니다.',
  },
  {
    icon: '📈',
    title: 'AI 시대의 개발자 기준',
    desc: 'AI가 코드를 짜는 시대, 더 중요해진 건 설계 능력·검증 판단력·도메인 깊이입니다. 저는 그 기준에 맞춰 성장합니다.',
  },
]

export default function Home() {
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
              오민성
            </span>
            입니다
          </h1>
          <p
            className="text-[var(--font-size-h3)] text-[var(--text-muted)] mb-4 animate-[fade-up_0.6s_ease_both]"
            style={{ animationDelay: '0.16s' }}
          >
            Backend Developer
          </p>
          <p
            className="text-[var(--font-size-body1)] text-[var(--text-muted)] mb-10 max-w-xl mx-auto animate-[fade-up_0.6s_ease_both]"
            style={{ animationDelay: '0.24s' }}
          >
            데이터의 안정성과 품질 보장, 그리고 AI 협업으로 혼자서도 팀처럼 일합니다.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PHILOSOPHY_ITEMS.map((item, index) => (
            <div
              key={item.title}
              className="
                bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)]
                p-6 shadow-[var(--shadow-sm)]
                hover:shadow-[var(--shadow-md)] hover:border-[var(--color-brand-purple)]/50 hover:-translate-y-1
                transition-all duration-[var(--transition-base)]
                animate-[fade-up_0.5s_ease_both]
              "
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-[var(--font-size-h3)] font-semibold text-[var(--text)] mb-2">
                {item.title}
              </h3>
              <p className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-[var(--text-muted)] text-[var(--font-size-caption)] mt-8">
          이 포트폴리오 사이트 자체가 AI 에이전트(PM·FE·BE·UI/UX)와 협업하여 Sprint 단위로 구축된 결과물입니다.
        </p>
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
