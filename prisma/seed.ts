import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ── Profile ──────────────────────────────────────────────────────
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '오민성',
      title: 'Backend Developer',
      bio: '데이터의 안정성과 품질 보장에 깊은 관심을 가진 백엔드 개발자입니다. 새로운 기술을 멈추지 않고 학습하며, AI를 팀원처럼 활용하는 개발 방식으로 혼자서도 팀처럼 일합니다.',
      email: 'dh65432@naver.com',
      phone: '010-4111-3455',
      location: '서울, 대한민국',
      github: 'https://github.com/beanteacher',
      blog: 'https://velog.io/@mings/posts',
    },
  })

  // ── Companies ─────────────────────────────────────────────────────
  const tigen = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '티젠소프트',
      role: '연구원 (메시징 개발팀)',
      startDate: new Date('2022-02-01'),
      endDate: new Date('2024-05-31'),
      isCurrent: false,
      description:
        '통합 메시징(UMS·카카오톡·PUSH·EMS·SURVEY) 솔루션 개발 및 운영. KT·비즈뿌리오·FCM·SMTP 등 다양한 외부 API를 연동하고, 고객사 Linux/Unix 서버에 솔루션 설치·유지보수를 담당했습니다.',
    },
  })

  const wisecan = await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '와이즈캔 네트웍스',
      role: '백엔드 개발자',
      startDate: new Date('2025-03-01'),
      isCurrent: true,
      description:
        '카카오 메시지 플랫폼 기반의 차세대 이전 프로젝트에 중간 투입되어 핵심 기능을 구현했습니다. 이후 OAM(운영·관리·모니터링) 시스템을 3인 팀으로 시작하여 1인 DRI 체제로 완주했습니다.',
    },
  })

  // ── Projects ──────────────────────────────────────────────────────
  await prisma.project.deleteMany()
  await prisma.project.createMany({
    data: [
      // Wisecan 차세대 이전
      {
        id: 1,
        title: '카카오 메시지 플랫폼 차세대 이전',
        description:
          '기존 레거시 카카오 메시징 시스템을 차세대 아키텍처로 전환하는 프로젝트에 중간 투입되어 카카오 알림톡·친구톡 템플릿 관리(검수요청·승인취소·수정·삭제), 프로필 생성·매칭, 인증키 관리, 최근 변경 템플릿 스케줄러 등 핵심 기능을 구현했습니다. React 기반 프론트엔드에서 RCS 템플릿 에디터 및 주소록 불러오기 기능도 함께 개발했습니다.',
        techStack: JSON.stringify(['Spring Boot', 'Spring Data JPA', 'React', 'MySQL', 'Tailwind CSS', 'QueryDSL']),
        achievements: JSON.stringify([
          '카카오 엔터프라이즈 API 전체 연동 (알림톡·친구톡 템플릿 CRUD)',
          '최근 변경 템플릿 스케줄러 구현으로 실시간 동기화 자동화',
          'Tailwind v3 → v4 마이그레이션 단독 수행',
          'RCS 템플릿 에디터 및 주소록 불러오기 기능 FE 구현',
        ]),
        companyId: wisecan.id,
      },
      // Wisecan OAM
      {
        id: 2,
        title: 'OAM 운영·관리·모니터링 시스템',
        description:
          '메시징 플랫폼의 운영·관리·모니터링을 위한 OAM 시스템을 설계부터 구현까지 담당했습니다. 3인 팀으로 시작했으나 회사 사정으로 1인 DRI(Directly Responsible Individual) 체제로 전환하여 프로젝트를 완주했습니다. Prometheus 기반의 실시간 알람·대시보드와 전반적인 운영 관리 포인트를 구현했습니다.',
        techStack: JSON.stringify(['Spring Boot', 'Prometheus', 'React', 'MySQL', 'Grafana']),
        achievements: JSON.stringify([
          '3인 → 1인 DRI 전환 후 전체 설계·구현 단독 완수',
          'Prometheus 연동 실시간 시스템 알람 및 대시보드 구현',
          '운영 관리 포인트 전반 설계 및 구현',
        ]),
        companyId: wisecan.id,
      },
      // Tigen 통합 메시징
      {
        id: 3,
        title: '통합 메시징(UMS·카카오·EMS·SURVEY) 솔루션',
        description:
          'KT API 기반 문자(UMS), 비즈뿌리오 기반 카카오톡(ATALK·FTALK), FCM 기반 PUSH, SMTP/MIME 기반 대량 메일(EMS), Redis+RDBMS 기반 설문(SURVEY) 등 5개 채널의 통합 메시징 솔루션을 개발·운영했습니다. 대량 발송·예약 발송·개인화 메시지·부서별 발송·발송 통계 등 다양한 기능을 담당했습니다.',
        techStack: JSON.stringify(['Java', 'Spring Boot', 'Spring Framework', 'MyBatis', 'MySQL', 'OracleDB', 'Redis', 'JSP', 'jQuery']),
        achievements: JSON.stringify([
          'SPF·DKIM 설정 추가로 메일 발송 성공률 95% 이상 향상',
          '모놀리식 → 멀티 모듈 아키텍처 전환으로 서비스 간 결합도 감소',
          'KT 양방향 메시지 XML API 기반 커스텀 솔루션 개발',
          '고객사 Linux/Unix 서버 솔루션 설치 및 유지보수 다수 수행',
        ]),
        companyId: tigen.id,
      },
      // mcp-server 개인 프로젝트
      {
        id: 4,
        title: 'MCP Server — GitHub 커밋 대시보드',
        description:
          'Model Context Protocol(MCP) 서버와 GitHub API를 연동하여 커밋 내역 조회·일일 요약·사용자 레포 탐색 기능을 제공하는 개인 대시보드입니다. AI 에이전트(PM·FE·BE·UI/UX)와 협업하여 4 Sprint 만에 디자인 시스템부터 다크/라이트 모드까지 완성했습니다.',
        techStack: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'MCP']),
        achievements: JSON.stringify([
          'CRA → Next.js(App Router·TypeScript) 마이그레이션',
          'AI 에이전트 팀(PM/FE/BE/UI·UX) 협업으로 4 Sprint 완성',
          'Gemini API 연동 일일 커밋 자동 요약 기능 구현',
          'next build 에러 0건, tsc --noEmit 에러 0건',
        ]),
        githubUrl: 'https://github.com/beanteacher/mcp-server',
      },
    ],
  })

  // ── Skills ────────────────────────────────────────────────────────
  await prisma.skill.deleteMany()
  await prisma.skill.createMany({
    data: [
      // Backend
      { id: 1,  name: 'Java',             category: 'Backend',  proficiency: 5, sortOrder: 1 },
      { id: 2,  name: 'Spring Boot',      category: 'Backend',  proficiency: 5, sortOrder: 2 },
      { id: 3,  name: 'Spring Framework', category: 'Backend',  proficiency: 4, sortOrder: 3 },
      { id: 4,  name: 'Spring Data JPA',  category: 'Backend',  proficiency: 4, sortOrder: 4 },
      { id: 5,  name: 'QueryDSL',         category: 'Backend',  proficiency: 4, sortOrder: 5 },
      { id: 6,  name: 'MyBatis',          category: 'Backend',  proficiency: 4, sortOrder: 6 },
      // Frontend
      { id: 7,  name: 'React',            category: 'Frontend', proficiency: 3, sortOrder: 1 },
      { id: 8,  name: 'TypeScript',       category: 'Frontend', proficiency: 3, sortOrder: 2 },
      { id: 9,  name: 'Next.js',          category: 'Frontend', proficiency: 3, sortOrder: 3 },
      { id: 10, name: 'Tailwind CSS',     category: 'Frontend', proficiency: 3, sortOrder: 4 },
      { id: 11, name: 'JavaScript',       category: 'Frontend', proficiency: 3, sortOrder: 5 },
      // Database
      { id: 12, name: 'MySQL',            category: 'Database', proficiency: 4, sortOrder: 1 },
      { id: 13, name: 'OracleDB',         category: 'Database', proficiency: 3, sortOrder: 2 },
      { id: 14, name: 'Redis',            category: 'Database', proficiency: 3, sortOrder: 3 },
      // DevOps / Infra
      { id: 15, name: 'Docker',           category: 'DevOps',   proficiency: 3, sortOrder: 1 },
      { id: 16, name: 'Prometheus',       category: 'DevOps',   proficiency: 3, sortOrder: 2 },
      // Tool
      { id: 17, name: 'Git',             category: 'Tool',     proficiency: 5, sortOrder: 1 },
      { id: 18, name: 'GitLab',          category: 'Tool',     proficiency: 4, sortOrder: 2 },
    ],
  })

  // ── Philosophy ────────────────────────────────────────────────────
  await prisma.philosophy.deleteMany()
  await prisma.philosophy.createMany({
    data: [
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
    ],
  })

  console.log('✅ 시드 데이터 삽입 완료 — 오민성 포트폴리오')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
