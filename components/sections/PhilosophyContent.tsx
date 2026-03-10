'use client'

import { useInView } from '@/lib/hooks/useInView'

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

function PhilosophyCard({
  item,
  index,
}: {
  item: (typeof PHILOSOPHY_ITEMS)[number]
  index: number
}) {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="
        bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)]
        p-6 shadow-[var(--shadow-sm)]
        hover:shadow-[var(--shadow-md)] hover:border-[var(--color-brand-purple)]/50 hover:-translate-y-1
        transition-[box-shadow,border-color,transform] duration-[var(--transition-base)]
      "
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s, box-shadow var(--transition-base), border-color var(--transition-base)`,
      }}
    >
      <div className="text-3xl mb-3">{item.icon}</div>
      <h3 className="text-[var(--font-size-h3)] font-semibold text-[var(--text)] mb-2">
        {item.title}
      </h3>
      <p className="text-[var(--text-muted)] text-[var(--font-size-body2)] leading-relaxed">
        {item.desc}
      </p>
    </div>
  )
}

export function PhilosophyContent() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PHILOSOPHY_ITEMS.map((item, index) => (
          <PhilosophyCard key={item.title} item={item} index={index} />
        ))}
      </div>
      <p className="text-center text-[var(--text-muted)] text-[var(--font-size-caption)] mt-8">
        이 포트폴리오 사이트 자체가 AI 에이전트(PM·FE·BE·UI/UX)와 협업하여 Sprint 단위로 구축된 결과물입니다.
      </p>
    </>
  )
}
