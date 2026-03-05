# WBS - Resume (개인 이력 포트폴리오 사이트)

## Sprint 1: 기반 구축 + 디자인 시스템

| WBS ID | 작업명 | 담당 | 시작 | 종료 | 산출물 | DoD | 의존성 |
|--------|--------|------|------|------|--------|-----|--------|
| 1.1 | GitHub 저장소 초기화 | PM | D1 | D1 | 초기화된 repo, .gitignore, README | repo clone 가능, branch 전략 적용 | 사용자 승인 |
| 1.2 | Next.js 프로젝트 스캐폴딩 | FE | D1 | D2 | Next.js 14 + TS + Tailwind 초기 구조 | `npx tsc --noEmit` 0건, `npm run build` 성공 | 1.1 |
| 1.3 | Prisma 설정 + DB 스키마 설계 | BE | D1 | D3 | schema.prisma, 마이그레이션 파일 | `npx prisma migrate dev` 성공, 4개 테이블 생성 | 1.1 |
| 1.4 | 시드 데이터 작성 | BE | D3 | D4 | prisma/seed.ts | `npx prisma db seed` 성공, 실제 이력 데이터 5건+ | 1.3 |
| 1.5 | API Routes 설계 + 구현 | BE | D4 | D6 | app/api/ 엔드포인트 | GET API 응답 정상, TypeScript 타입 안전 | 1.3 |
| 1.6 | 디자인 시스템 확정 | UI/UX | D1 | D4 | Figma Design System 파일, design-tokens.md | 컬러/타이포/스페이싱/컴포넌트 정의 완료 | - |
| 1.7 | 와이어프레임 Lo-fi | UI/UX | D4 | D7 | Figma Wireframe 파일 | 전체 페이지 Lo-fi 완성, 사용자 동선 검증 | 1.6 |
| 1.8 | 공통 컴포넌트 구현 | FE | D5 | D7 | Header, Footer, Layout, Button, Card 등 | 디자인 토큰 반영, 반응형 기본 적용 | 1.2, 1.6 |
| 1.9 | tailwind.config.ts 디자인 토큰 반영 | FE | D4 | D5 | tailwind.config.ts, globals.css | 디자인 시스템 컬러/폰트/스페이싱 반영 | 1.6 |
| 1.10 | Sprint 1 통합 검증 | PM | D7 | D7 | 빌드 성공 보고 | tsc 0건 + build 성공 + API 동작 확인 | 1.2~1.9 |

## Sprint 2: 핵심 UI 구현

| WBS ID | 작업명 | 담당 | 시작 | 종료 | 산출물 | DoD | 의존성 |
|--------|--------|------|------|------|--------|-----|--------|
| 2.1 | Hi-fi 시안 (메인 + 이력 섹션) | UI/UX | D1 | D3 | Figma Hi-fi 파일 | PC + Mobile 시안 완성 | 1.7 |
| 2.2 | Hero 섹션 구현 | FE | D2 | D4 | Hero 컴포넌트 | 애니메이션 적용, 반응형 | 2.1 |
| 2.3 | About/소개 섹션 구현 | FE | D4 | D5 | About 섹션 컴포넌트 | 스크롤 진입 애니메이션 | 2.1 |
| 2.4 | 이력(Experience) 섹션 -- 무한 스크롤/타임라인 | FE | D5 | D8 | Experience 컴포넌트 | DB 데이터 연동, 스크롤 애니메이션, 무한 스크롤 or 타임라인 | 1.5, 2.1 |
| 2.5 | 프로젝트 상세 페이지 | FE | D8 | D10 | /projects/[id] 페이지 | 동적 라우팅, DB 연동, SEO meta 태그 | 1.5, 2.1 |
| 2.6 | Hi-fi 시안 (프로젝트 상세 + 기술 스택) | UI/UX | D3 | D6 | Figma Hi-fi 파일 | 프로젝트 상세 + 스킬 시각화 시안 | 1.7 |
| 2.7 | 반응형 레이아웃 전체 적용 | FE | D10 | D12 | 전 페이지 반응형 | Mobile 375px ~ Desktop 1280px+ 대응 | 2.2~2.5 |
| 2.8 | Sprint 2 통합 검증 | PM | D12 | D12 | 빌드 성공 보고 | tsc 0건 + build 성공 + 전 페이지 동작 확인 | 2.2~2.7 |

## Sprint 3: 관리 기능 + 배포

| WBS ID | 작업명 | 담당 | 시작 | 종료 | 산출물 | DoD | 의존성 |
|--------|--------|------|------|------|--------|-----|--------|
| 3.1 | Admin 페이지 설계 | UI/UX | D1 | D2 | Figma Admin 와이어프레임 | CRUD UI 설계 완료 | - |
| 3.2 | Admin 인증 (간단 비밀번호 or OAuth) | BE | D1 | D3 | 인증 미들웨어 | 비인가 접근 차단 | - |
| 3.3 | Admin CRUD 페이지 구현 | FE+BE | D3 | D7 | /admin 페이지들 | 이력/프로젝트/기술 CRUD 동작 | 3.1, 3.2 |
| 3.4 | 기술 스택 시각화 | FE | D5 | D7 | Skills 섹션 컴포넌트 | 기술별 숙련도/카테고리 시각화 | 2.6 |
| 3.5 | SEO 최적화 | FE | D7 | D9 | meta 태그, OG 태그, sitemap.xml, robots.txt | Lighthouse SEO 90+ | 2.5 |
| 3.6 | Vercel 배포 설정 | FE+BE | D9 | D10 | Vercel 프로젝트, 환경변수 설정 | 프로덕션 빌드 + 배포 성공 | 3.3, 3.5 |
| 3.7 | 커스텀 도메인 연결 | PM | D10 | D10 | 도메인 DNS 설정 | HTTPS 접속 가능 | 3.6, 사용자 도메인 결정 |
| 3.8 | Sprint 3 통합 검증 | PM | D10 | D10 | 배포 완료 보고 | 프로덕션 사이트 정상 접근 + 전 기능 동작 | 3.3~3.7 |

## Sprint 4: 폴리싱 + 릴리즈

| WBS ID | 작업명 | 담당 | 시작 | 종료 | 산출물 | DoD | 의존성 |
|--------|--------|------|------|------|--------|-----|--------|
| 4.1 | 애니메이션 세부 조정 | FE | D1 | D3 | 전 페이지 인터랙션 개선 | 부드러운 전환, 성능 저하 없음 | 3.8 |
| 4.2 | Lighthouse 성능 최적화 | FE | D3 | D4 | 이미지 최적화, 코드 스플리팅 | Performance/Accessibility/SEO 각 90+ | 4.1 |
| 4.3 | 크로스 브라우저/디바이스 테스트 | PM+FE | D4 | D5 | 테스트 결과 보고 | Chrome/Safari/Firefox + iOS/Android 정상 | 4.2 |
| 4.4 | 최종 릴리즈 | PM | D5 | D5 | 릴리즈 보고 | 모든 게이트 통과, 프로덕션 배포 완료 | 4.3 |
