import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '김개발',
      title: 'Full Stack Developer',
      bio: '3년차 풀스택 개발자. Next.js와 Spring Boot를 주로 사용하며, 사용자 경험을 중시하는 개발을 추구합니다.',
      email: 'dev@example.com',
      phone: '010-1234-5678',
      location: '서울, 대한민국',
      github: 'https://github.com/beanteacher',
      linkedin: 'https://linkedin.com/in/example',
      blog: 'https://blog.example.com',
    },
  })

  const company1 = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '테크스타트업 주식회사',
      role: 'Frontend Developer',
      startDate: new Date('2023-03-01'),
      isCurrent: true,
      description: 'B2B SaaS 플랫폼 개발. Next.js 기반 대시보드 및 관리자 시스템 구축.',
    },
  })

  const company2 = await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '이커머스 코리아',
      role: 'Full Stack Developer',
      startDate: new Date('2021-07-01'),
      endDate: new Date('2023-02-28'),
      isCurrent: false,
      description: '온라인 쇼핑몰 플랫폼 개발 및 운영. React + Spring Boot 기반 마이크로서비스 아키텍처 구현.',
    },
  })

  await prisma.project.createMany({
    data: [
      {
        id: 1,
        title: 'B2B 대시보드 플랫폼',
        description: '기업 고객을 위한 데이터 분석 대시보드. 실시간 데이터 시각화 및 리포트 기능 제공.',
        techStack: JSON.stringify(['Next.js', 'TypeScript', 'TanStack Query', 'Recharts', 'Tailwind CSS']),
        achievements: JSON.stringify(['MAU 2,000+ 달성', '페이지 로딩 속도 40% 개선', 'TypeScript 전환으로 버그 30% 감소']),
        githubUrl: 'https://github.com/beanteacher/dashboard',
        companyId: company1.id,
      },
      {
        id: 2,
        title: '실시간 알림 시스템',
        description: 'WebSocket 기반 실시간 푸시 알림 시스템 설계 및 구현.',
        techStack: JSON.stringify(['Next.js', 'WebSocket', 'Redis', 'Node.js']),
        achievements: JSON.stringify(['알림 전달 지연 200ms 이하 달성', '동시 접속자 10,000명 처리']),
        companyId: company1.id,
      },
      {
        id: 3,
        title: '쇼핑몰 검색 고도화',
        description: 'Elasticsearch 기반 상품 검색 시스템 재구축. 자동완성, 오타 교정, 연관 검색어 제공.',
        techStack: JSON.stringify(['React', 'Spring Boot', 'Elasticsearch', 'Redis']),
        achievements: JSON.stringify(['검색 전환율 25% 향상', '검색 응답시간 50ms 이하 달성']),
        companyId: company2.id,
      },
      {
        id: 4,
        title: '주문 결제 시스템 리팩토링',
        description: '레거시 결제 시스템을 MSA로 분리. 토스페이먼츠 연동 및 결제 안정성 강화.',
        techStack: JSON.stringify(['Spring Boot', 'Kafka', 'PostgreSQL', 'Docker']),
        achievements: JSON.stringify(['결제 성공률 99.5% 달성', '결제 처리 시간 3초→1초 단축']),
        companyId: company2.id,
      },
      {
        id: 5,
        title: '개인 포트폴리오 사이트',
        description: 'Next.js 16 App Router 기반 개인 포트폴리오. Prisma + SQLite, 다크/라이트 모드, 반응형 지원.',
        techStack: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'SQLite']),
        achievements: JSON.stringify(['Lighthouse 성능 점수 95+', 'SEO 최적화 (meta, OG tags, sitemap)']),
        githubUrl: 'https://github.com/beanteacher/resume',
        demoUrl: 'https://portfolio.example.com',
      },
    ],
  })

  await prisma.skill.createMany({
    data: [
      { id: 1, name: 'Next.js', category: 'Frontend', proficiency: 5, sortOrder: 1 },
      { id: 2, name: 'React', category: 'Frontend', proficiency: 5, sortOrder: 2 },
      { id: 3, name: 'TypeScript', category: 'Frontend', proficiency: 4, sortOrder: 3 },
      { id: 4, name: 'Tailwind CSS', category: 'Frontend', proficiency: 5, sortOrder: 4 },
      { id: 5, name: 'Zustand', category: 'Frontend', proficiency: 4, sortOrder: 5 },
      { id: 6, name: 'Spring Boot', category: 'Backend', proficiency: 4, sortOrder: 1 },
      { id: 7, name: 'Node.js', category: 'Backend', proficiency: 3, sortOrder: 2 },
      { id: 8, name: 'Prisma', category: 'Backend', proficiency: 4, sortOrder: 3 },
      { id: 9, name: 'PostgreSQL', category: 'Database', proficiency: 4, sortOrder: 1 },
      { id: 10, name: 'Redis', category: 'Database', proficiency: 3, sortOrder: 2 },
      { id: 11, name: 'Docker', category: 'DevOps', proficiency: 3, sortOrder: 1 },
      { id: 12, name: 'Git', category: 'Tool', proficiency: 5, sortOrder: 1 },
      { id: 13, name: 'Figma', category: 'Tool', proficiency: 3, sortOrder: 2 },
    ],
  })

  console.log('시드 데이터 삽입 완료')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
