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

export default function Home() {
  return (
    <Layout>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <HeroSection />

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
    </Layout>
  )
}
