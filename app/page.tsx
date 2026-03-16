import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { Layout } from '@/components/layout/Layout'
import { Section } from '@/components/sections/Section'
import { HeroSection } from '@/components/sections/HeroSection'
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
  const tagline = profile?.tagline ?? '메시징 백엔드 전문 · Java/Spring Boot · AI 협업으로 혼자서도 팀처럼 일합니다.'

  return (
    <Layout>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <HeroSection name={name} title={title} tagline={tagline} />

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

      {/* ── Projects ───────────────────────────────────────────── */}
      <Section id="projects" title="Projects" subtitle="프로젝트">
        <ProjectsSection />
      </Section>

      {/* ── Skills ─────────────────────────────────────────────── */}
      <Section id="skills" title="Skills" subtitle="기술 스택">
        <SkillsSection />
      </Section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <Section id="contact" title="Contact" subtitle="연락하기">
        <ContactSection />
      </Section>
    </Layout>
  )
}
