# MASTER_PLAN - Resume (개인 이력 포트폴리오 사이트)

## 프로젝트 개요

- **프로젝트명**: Resume
- **GitHub**: https://github.com/beanteacher/resume (초기화 후 재시작)
- **목적**: 개발 경험(회사, 프로젝트, 기술 스택, 성과)을 Persona 기반으로 관리하고, 현대적 UX의 포트폴리오/이력서 웹 사이트 구축
- **공개 범위**: Public (포트폴리오 용도)

---

## 최종 목표

외부에 공개 가능한 개인 포트폴리오 사이트로, 아래 핵심 가치를 전달한다:
1. **Persona 기반 이력 데이터 관리** -- 회사/프로젝트/기술스택/성과를 구조화하여 DB에서 관리
2. **현대적 UX** -- 무한 스크롤, 스크롤 기반 애니메이션, 부드러운 전환 효과
3. **외부 공유** -- 채용 담당자/동료에게 링크 하나로 이력 전체를 보여줄 수 있는 형태

---

## 기술 스택 결정

| 분류 | 기술 | 선택 이유 |
|------|------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | FE 페르소나 기본 스택, SSR/SSG로 SEO 최적화 (포트폴리오 필수) |
| **스타일링** | Tailwind CSS 3.x | FE 페르소나 기본 스택, 빠른 UI 구현 |
| **애니메이션** | Framer Motion | 무한 스크롤, 스크롤 기반 애니메이션, 페이지 전환에 적합 |
| **Backend** | Next.js API Routes + Prisma ORM | 별도 Spring MSA 불필요 (개인 포트폴리오 규모), Monorepo 단일 배포 |
| **DB** | SQLite (개발) / PostgreSQL (운영) | Prisma 호환, 무료 Tier(Vercel Postgres, Supabase 등) 활용 가능 |
| **배포** | Vercel | Next.js 최적 호스팅, 무료 Tier, 커스텀 도메인 지원 |
| **CMS/관리** | Prisma Studio 또는 Admin 페이지 | 이력 데이터 CRUD를 위한 관리 인터페이스 |

### BE 스택 결정 근거

BE 페르소나는 MSA/Spring Boot 기반이지만, Resume 프로젝트는:
- **단일 사용자** 포트폴리오 -- 트래픽 분산, 서비스 간 통신 불필요
- **데이터 모델 단순** -- 회사/프로젝트/기술스택/성과 4개 엔티티 중심
- **빠른 배포 우선** -- Spring Boot + Docker 인프라보다 Vercel 원클릭 배포가 합리적
- **SEO 필수** -- Next.js SSG/ISR로 정적 페이지 생성이 포트폴리오에 최적

따라서 **Next.js Full-Stack (API Routes + Prisma)** 단일 스택으로 결정한다.
BE 페르소나의 역할은 **DB 스키마 설계, API 설계, 데이터 모델링**에 집중한다.

---

## 팀 구성

| 역할 | 담당 | 핵심 책임 |
|------|------|-----------|
| **PM** | Project Manager | 계획/일정/품질/리스크 관리 |
| **FE** | Frontend Developer | UI 구현, 애니메이션, 반응형 |
| **BE** | Backend Developer | DB 스키마, API Routes, Prisma 모델, 데이터 시딩 |
| **UI/UX** | Designer | 디자인 시스템, 와이어프레임, Hi-fi 시안 |

### 팀 구성 검토 결과

4인 구성으로 **충분**하다. 추가 인원 불필요 사유:
- DevOps 별도 불필요: Vercel 자동 배포로 인프라 관리 최소화
- QA 별도 불필요: 개인 프로젝트 규모, FE/BE가 자체 테스트 수행
- 3D/AI 기능 없음: 이력 데이터 표시 중심

---

## 단계별 마일스톤

### Sprint 1 (2주) -- 기반 구축 + 디자인 시스템
- GitHub 저장소 초기화 (사용자 승인 후)
- Next.js 프로젝트 스캐폴딩 + Prisma 설정
- DB 스키마 설계 및 시드 데이터 작성
- 디자인 시스템 (컬러/타이포/컴포넌트) 확정
- 와이어프레임 Lo-fi 완성

### Sprint 2 (2주) -- 핵심 UI 구현
- 메인 페이지 (Hero + 소개 섹션)
- 이력 섹션 (무한 스크롤 or 스크롤 애니메이션)
- 프로젝트 상세 페이지
- 반응형 레이아웃 (Desktop + Mobile)

### Sprint 3 (2주) -- 관리 기능 + 배포
- Admin 페이지 (이력 데이터 CRUD)
- 기술 스택 시각화
- SEO 최적화 (meta, OG tags, sitemap)
- Vercel 배포 + 커스텀 도메인 설정

### Sprint 4 (1주) -- 폴리싱 + 릴리즈 ✅
- 애니메이션 세부 조정
- 성능 최적화 (Lighthouse 90+)
- 최종 QA + 릴리즈

### Sprint 5 (1일) -- 스킬 정렬 UX 개선 ✅
- sortOrder=0 입력 시 기존 스킬 전체 +1, 신규 스킬 1번 배치
- 중복 sortOrder 입력 시 409 에러 메시지 표시
- DELETE 후 동일 카테고리 sortOrder 1부터 연속 재정렬
- @dnd-kit 기반 드래그앤드롭 순서 변경 UI (카테고리 내)
- Admin CUD 후 즉시 목록 반영 버그 수정 (unstable_cache 제거)

---

## 릴리즈 게이트

| 게이트 | 기준 |
|--------|------|
| **기능 게이트** | 이력 표시, 프로젝트 상세, 기술 스택 시각화 완료 |
| **품질 게이트** | TypeScript 에러 0건, next build 성공, Lighthouse 90+ |
| **운영 게이트** | Vercel 배포 완료, 커스텀 도메인 연결, HTTPS 활성화 |
| **SEO 게이트** | OG 태그, sitemap.xml, robots.txt 적용 완료 |

---

## 핵심 리스크

| # | 리스크 | 영향 | 완화책 |
|---|--------|------|--------|
| 1 | 이력 데이터 구조 확정 지연 | 전체 일정 지연 | Sprint 1에서 데이터 모델 우선 확정 |
| 2 | 디자인 방향 미합의 | UI 구현 지연 | Sprint 1에서 디자인 시스템 + 와이어프레임 선확정 |
| 3 | 무한 스크롤/애니메이션 성능 이슈 | UX 품질 저하 | Framer Motion lazy loading + 가상화(virtualization) 적용 |
