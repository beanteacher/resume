# Resume Portfolio — Project Memory

> 프로젝트 루트: `C:/Users/wisecan/Desktop/min/workspace/resume`
> 페르소나 루트: `C:/Users/wisecan/Desktop/min/workspace/persona`
> 플랫폼: Windows 11 / Shell: bash (Unix 경로 사용)

---

## 필수 사전 읽기 (에이전트 실행 전 반드시 읽을 것)

작업 시작 전 아래 AGENTS.md 파일을 **모두 읽어야** 한다. 규칙 위반 시 결과물이 반려된다.

| 파일 | 역할 |
|------|------|
| `C:/Users/wisecan/Desktop/min/workspace/persona/AGENTS.md` | 공통 규칙 (git push 금지, 커밋 컨벤션, 보고 형식 등) |
| `C:/Users/wisecan/Desktop/min/workspace/persona/frontend_developer/AGENTS.md` | FE 에이전트 규칙 |
| `C:/Users/wisecan/Desktop/min/workspace/persona/project_manager/AGENTS.md` | PM 에이전트 규칙 |
| `C:/Users/wisecan/Desktop/min/workspace/persona/uiux_designer/AGENTS.md` | UI/UX 에이전트 규칙 |

---

## 프로젝트 개요

- **목적**: 개인 포트폴리오/이력서 웹사이트 (Public 공개)
- **GitHub**: https://github.com/beanteacher/resume
- **배포 목표**: Vercel + 커스텀 도메인 (Sprint 3)

## 실제 기술 스택 (페르소나 기본값과 다름)

| 분류 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js 16 (App Router) + React 19 | 페르소나는 14 기준 |
| 스타일 | Tailwind CSS v4 (`@theme` 블록) | 페르소나는 v3 기준 |
| 애니메이션 | **Tailwind CSS keyframes만 사용** | framer-motion 설치 안 함 |
| ORM | Prisma 5 + SQLite → PostgreSQL | 단일 스택 (Spring MSA 없음) |
| 테마 | next-themes (다크 기본) | |
| 서버 캐싱 | Next.js `unstable_cache` + `revalidateTag` | revalidateTag(tag, {}) — 2번째 인수 필수 |
| 클라이언트 캐싱 | `@tanstack/react-query` | Admin 페이지 전용 |
| 패키지 매니저 | npm | |

> FE 페르소나 명시: "framer-motion 없이 Tailwind keyframes만으로 충분"

---

## 실제 프로필 데이터 (seed 완료)

- **이름**: 오민성 | **직함**: Backend Developer
- **이메일**: dh65432@naver.com | **전화**: 010-4111-3455
- **GitHub**: https://github.com/beanteacher | **블로그**: https://velog.io/@mings/posts
- **경력**: 티젠소프트(2022.02~2024.05) → 와이즈캔 네트웍스(2025.03~현재)
- **학력**: 서일대학교 컴퓨터전자공학과(2016~2022) | **자격**: SQLD(2024.09)

---

## Sprint 1 + 데이터 입력 완료 상태 ✅

- [x] **BE**: Prisma 스키마 4모델, DB 마이그레이션, 시드 데이터(실제 이력), API Routes 5개
- [x] **FE**: Next.js 16 스캐폴딩, Tailwind v4 디자인 토큰, 공통 컴포넌트, 다크/라이트 모드
- [x] **FE**: Philosophy 섹션 추가 (page.tsx — About·Experience 사이, 카드 4개)
- [x] **FE**: Header에 Philosophy 네비 링크 추가
- [x] **FE**: Footer 실제 링크(GitHub·Velog·Email) 반영
- [x] **FE**: layout.tsx 메타데이터 실명 반영 (오민성)
- [x] **PM**: MASTER_PLAN, WBS, SPRINT1_PLAN, SPRINT2_PLAN 작성
- [x] **.env**: `DATABASE_URL="file:./dev.db"` 생성 (로컬 전용, .gitignore로 보호)
- [x] **UI/UX**: 디자인 시스템 확정, Figma 매니페스트 Day1 아카이브
- [ ] 와이어프레임 Lo-fi 미완성 → Sprint 2 Hi-fi로 직행
- [ ] 프로젝트 루트 AGENTS.md 미작성

## 페이지 섹션 순서 (현재 확정)

Hero → About → **Philosophy** → Experience → Skills → Projects → Contact

---

## Sprint 2 작업 목록 (WBS 2.1~2.9)

| ID | 작업 | 담당 | 의존성 |
|----|------|------|--------|
| 2.1 | Hi-fi 시안 (메인 + 이력 섹션) | UI/UX | - |
| 2.2 | Hero 섹션 애니메이션 (Tailwind keyframes) | FE | 2.1 |
| 2.3 | About 섹션 — `/api/profile` 연동 | FE | 2.1 |
| 2.4 | Experience 섹션 — 타임라인 + `/api/companies` 연동 | FE | 2.1 |
| 2.5 | Projects 섹션 — 무한 스크롤(cursor) + `/projects/[id]` 상세 | FE | 2.1 |
| 2.6 | Hi-fi 시안 (프로젝트 상세 + Skills) | UI/UX | - |
| 2.7 | Skills 섹션 — 카테고리별 숙련도 시각화 | FE | 2.6 |
| 2.8 | 반응형 전체 적용 (375px ~ 1280px+) | FE | 2.2~2.7 |
| 2.9 | Sprint 2 통합 검증 | PM | 2.2~2.8 |

**Sprint 2 DoD**: `npx tsc --noEmit` 0건 + `npm run build` 성공 + 전 섹션 DB 연동

---

## 핵심 규칙 (페르소나 AGENTS.md 요약)

### 공통 (루트 AGENTS.md)
- **git push 자동 실행 절대 금지** — 사용자 승인 형식으로 보고 후 허가받아야 함
- 커밋 메시지: Conventional Commits, scope 없음 (`feat: 설명`)
- PM 선보고 → Sub Agent 실행 → 종료 보고 순서 고정
- 보고에 placeholder(TBD, 추후 작성) 금지 — 실제 파일 경로 필수

### FE
- `any` 사용 금지, named export만, default export 금지
- Tailwind 조건부 클래스는 `cn()` 유틸 사용
- CSS 변수 패턴: `var(--color-brand-purple)`, `var(--text)` 등
- stagger 애니메이션: `animationDelay: \`${index * 0.04}s\``

### BE (이 프로젝트 한정)
- Spring MSA 아님 — Prisma + Next.js API Routes 단일 스택
- API 응답: `ApiResponse<T> = { data: T, error?: string }`
- techStack/achievements: DB에 JSON.stringify 문자열 → 클라이언트에서 파싱

### UI/UX
- 매 일차 작업 후 `uiux_designer/figma-manifests/dayN-YYYY-MM-DD/` 아카이브 필수
- Figma manifest 덮어쓰기 금지 — 일자별 불변 저장
- **Figma 로드 필수 4파일 구조** (하나라도 없으면 Figma가 플러그인 인식 불가):
  ```
  dayN-YYYY-MM-DD/
  ├── manifest.json              ← { name, api:"1.0.0", id, main:"code.js", ui:"ui.html", editorType:["figma"] }
  ├── manifest.import-data.json  ← frames 배열 + designTokens
  ├── code.js                    ← figma.showUI + FRAME_SPECS + CATEGORY_COLOR + loadFontSafe()
  └── ui.html                    ← 버튼 → parent.postMessage({ pluginMessage: { type } }, "*")
  ```
- id 패턴: `{project-slug}-day{N}-{YYYY-MM-DD}`
- CATEGORY_COLOR (hex→{r,g,b} 0~1): `hero(#7C3AED)` `about(#3B82F6)` `philosophy(#06B6D4)` `experience(#4338CA)` `skills(#9933CC)` `projects(#2563EB)` `contact(#10B981)`

### PM
- 계획 문서 없이 실행 금지
- 완료 보고: "가장 중요한 작업 1개 + 실제 파일 경로"

### 전체 공통 — MEMORY.md 업데이트 규칙
- **작업 종료 시 반드시 `MEMORY.md` 업데이트** (프로젝트 루트: `resume/MEMORY.md`)
- 업데이트 항목: 완료된 작업 체크박스, 새로 확인된 패턴/규칙, 변경된 파일 경로
- MEMORY.md는 **프로젝트 폴더 하위에만 위치** (`resume/MEMORY.md`) — 다른 경로 금지
- 업데이트 없이 커밋/종료 금지

---

## 주요 파일 경로

```
MEMORY.md                     — 이 파일 (프로젝트 루트)
prisma/schema.prisma          — DB 스키마 (Profile/Company/Project/Skill)
prisma/seed.ts                — 시드 데이터 (실제 이력 반영 완료)
app/page.tsx                  — 메인 페이지 (Philosophy 섹션 포함)
app/globals.css               — Tailwind v4 @theme 디자인 토큰
app/api/                      — GET /profile /companies /projects /projects/[id] /skills
components/layout/            — Header(스크롤 감지/다크모드/Philosophy 링크), Footer, Layout
components/ui/                — Button(variant), Card(hover), ScrollIndicator(스크롤 감지 fade-out)
components/sections/          — AboutSection(서버), AboutContent(클라이언트+useInView)
components/common/            — LoadingState, EmptyState
lib/hooks/useInView.ts        — IntersectionObserver 훅 (threshold 0.15, 진입 후 unobserve)
types/index.ts                — ApiResponse<T>, SkillsByCategory
uiux_designer/design-tokens.md — 디자인 토큰 전체 (CSS 변수 포함)
.omc/plans/                   — MASTER_PLAN, WBS, SPRINT1_PLAN, SPRINT2_PLAN
```

---

## Sprint 2 진행 상태

- [x] **D1 UI/UX (2026-03-05)**: Hi-fi 시안 Day2 Figma 아카이브 생성
  - `uiux_designer/figma-manifests/day2-2026-03-05/` (4파일: manifest.json, manifest.import-data.json, code.js, ui.html)
  - 14개 프레임: Hero·About·Philosophy·Experience·Skills·Projects·Contact 각 PC+Mobile
  - commit: `a6c2a8b`
- [x] **D2~D4 FE**: Hero 섹션 애니메이션 강화 (Tailwind keyframes stagger + 스크롤 다운 인디케이터)
  - `components/ui/ScrollIndicator.tsx` — scroll 감지 fade-out + animate-bounce 화살표
  - `lib/hooks/useInView.ts` — IntersectionObserver 기반 한번 진입 후 유지
  - `app/page.tsx` — 각 자식 요소 개별 fade-up + stagger delay (0s~0.4s)
- [x] **D4~D5 FE**: About 섹션 (`/api/profile` 연동) — 부분 완료 (D2에 시작)
  - `components/sections/AboutSection.tsx` — 서버 컴포넌트 (Prisma 직접 사용)
  - `components/sections/AboutContent.tsx` — 클라이언트 래퍼 (useInView 스크롤 애니메이션 + 소셜 링크 카드)
- [x] **D5~D7 FE (2026-03-06)**: Experience 섹션 (버티컬 타임라인 + `/api/companies` 연동)
  - `components/sections/ExperienceSection.tsx` (서버 컴포넌트, Prisma 직접 + DateTime 직렬화)
  - `components/sections/ExperienceContent.tsx` (클라이언트, 버티컬 타임라인, useInView stagger)
  - 날짜 포맷 YYYY.MM, isCurrent "재직 중" 뱃지, techStack JSON 파싱
- [x] **D7~D9 FE (2026-03-06)**: Projects 섹션 (cursor 기반 무한 스크롤 + 카드 그리드)
  - `components/sections/ProjectsSection.tsx` (서버 컴포넌트, Prisma 직접 + DateTime 직렬화)
  - `components/sections/ProjectsContent.tsx` (클라이언트, IntersectionObserver 무한 스크롤, 3컬럼 그리드)
  - `types/index.ts` — SerializedProject, SerializedCompany 타입 추가
- [x] **D9~D11 FE (2026-03-06)**: 프로젝트 상세 `/projects/[id]` (동적 라우팅 + SEO meta)
  - `app/projects/[id]/page.tsx` (서버 컴포넌트, generateMetadata, 기술스택 배지 + 성과 목록)
- [x] **D8~D10 FE (2026-03-06)**: Skills 섹션 (카테고리별 숙련도 dot 시각화)
  - `components/sections/SkillsSection.tsx` (서버 컴포넌트, Prisma 직접, ProficiencyDots 컴포넌트)
- [x] **D10~D11 FE (2026-03-06)**: Contact 섹션 (링크 카드)
  - `components/sections/ContactSection.tsx` (클라이언트, GitHub/Blog/Email 카드 3개)
- [x] **D3 UI/UX (2026-03-06)**: Hi-fi 시안 Day3 Figma 아카이브 생성
  - `uiux_designer/figma-manifests/day3-2026-03-06/` (4파일: manifest.json, manifest.import-data.json, code.js, ui.html)
  - 4개 프레임: ProjectDetail-PC/Mobile, Skills-PC/Mobile
- [x] **D12 PM (2026-03-06)**: Sprint 2 통합 검증 완료
  - `npx tsc --noEmit` 에러 0건
  - `npm run build` 성공 (exit 0)
  - 전 섹션 컴포넌트 연결: Hero/About/Philosophy/Experience/Skills/Projects/Contact
- [x] **추가 FE (2026-03-06)**: 활성 섹션 nav 하이라이트
  - `components/layout/Header.tsx` — IntersectionObserver(`rootMargin: '-20% 0px -60% 0px'`)로 현재 섹션 감지, 해당 nav gradient 색상 (PC + 모바일)
  - `components/sections/Section.tsx` — `scroll-mt-16` 추가 (헤더 가림 방지)
  - scroll-snap은 UX 이슈로 제거 → `scroll-behavior: smooth`만 유지
  - Contact 섹션 감지: 하단 80px 이내 도달 시 강제 활성화 (짧은 섹션 IntersectionObserver 한계 대응)
  - 최종 커밋: `b179972`

---

## Vercel 배포 현황

- **배포 URL**: https://resume-nine-gold.vercel.app
- **DB**: Neon PostgreSQL (ap-southeast-1) — `prisma/schema.prisma` provider: `postgresql`
- **빌드 스크립트**: `prisma generate && next build`
- **환경변수 (Vercel)**: `DATABASE_URL` (pgbouncer 풀링), `DIRECT_URL` (직접 연결)
- **마이그레이션**: `prisma/migrations/20260306074233_init/` (PostgreSQL init)
- **최초 배포 성공**: 2026-03-06 (커밋 `fae2bab`)

---

---

## Sprint 3 진행 상태

- [x] **D1 BE (2026-03-06)**: Admin 인증 미들웨어 + CRUD API Routes
  - `middleware.ts` — /admin/:path* 쿠키 검증, /admin/login whitelisted
  - `app/api/admin/login/route.ts` — POST, 비밀번호 검증 + admin_token 쿠키 설정
  - `app/api/admin/logout/route.ts` — POST, admin_token 쿠키 삭제
  - `app/api/companies/route.ts` — POST 추가 / `app/api/companies/[id]/route.ts` — GET/PUT/DELETE 신규
  - `app/api/projects/route.ts` — POST 추가 / `app/api/projects/[id]/route.ts` — PUT/DELETE 추가
  - `app/api/skills/route.ts` — POST 추가 / `app/api/skills/[id]/route.ts` — GET/PUT/DELETE 신규
  - `.env` — ADMIN_PASSWORD, ADMIN_SECRET 추가 (커밋 제외)
  - `npx tsc --noEmit` 에러 0건
- [x] **D1 UI/UX (2026-03-06)**: Admin 페이지 전체 화면 설계 Figma 아카이브 day4 생성
  - `uiux_designer/figma-manifests/day4-2026-03-06/` (4파일: manifest.json, manifest.import-data.json, code.js, ui.html)
  - 10개 Admin 프레임: Login(PC·Mobile), Dashboard(PC·Mobile), Company List/Form, Project List/Form, Skill List/Form
  - CATEGORY_COLOR에 admin 색상 추가: `{r:0.961, g:0.620, b:0.043}` (#F59E0B)
  - commit: `docs: Sprint 3 D1 UI/UX Admin 설계 Figma 아카이브 day4`
- [x] **D1 UI/UX Hotfix (2026-03-06)**: Figma import 빈 프레임(헤더/메타만 보이는 문제) 개선
  - 원인: day1~day4 `code.js`가 프레임 외곽/메타만 생성해 내부 UI가 비어 보임
  - 조치: `createRect`/`createText` 유틸 + 화면별 렌더 함수 추가로 내부 레이아웃 블록 생성
  - 수정 파일:
    - `uiux_designer/figma-manifests/day1-2026-03-05/code.js`
    - `uiux_designer/figma-manifests/day2-2026-03-05/code.js`
    - `uiux_designer/figma-manifests/day3-2026-03-06/code.js`
    - `uiux_designer/figma-manifests/day4-2026-03-06/code.js`
  - 검증: `node --check`로 day1~day4 `code.js` 문법 통과 (`all-syntax-ok`)
- [x] **D2 BE (2026-03-09)**: projects POST body 미사용 필드 정리
  - `app/api/projects/route.ts` POST body에서 `role`, `startDate`, `endDate` 제거
  - Prisma Project 모델에 없는 필드였음 (Company 모델의 필드와 혼용 오류)
  - `npx tsc --noEmit` 에러 0건 확인
- [x] **D2 UI/UX (2026-03-09)**: Admin 페이지 FE 핸드오프 문서 작성
  - `uiux_designer/day4-handoff-for-fe.md` — Admin 10개 프레임 스펙 + API 계약 + 컴포넌트 코드 샘플
  - 포함 내용: 파일 구조, 인증 플로우, 로그인/대시보드/Company/Project/Skill 화면 스펙, 타입 정의, 검증 규칙, 에러 처리
- [x] **D3 FE (2026-03-09)**: Admin 페이지 전체 구현 완료
  - UI 신규: `Input.tsx`(textarea 지원), `Badge.tsx`, `Select.tsx`(커스텀 드롭다운, ARIA 완비)
  - Admin 컴포넌트: `AdminSidebar`, `AdminTabBar`, `CompanyForm/List`, `ProjectForm/List`, `SkillForm/List`
  - Admin 페이지: `layout.tsx`, `login/page.tsx`, `page.tsx`(대시보드), `companies`, `projects`, `skills`
  - `npx tsc --noEmit` 에러 0건, `npm run build` 성공
- [x] **D4 FE (2026-03-09)**: API 누락 필드 + UI 버그 수정
  - API: `thumbnailUrl`, `iconUrl`, `sortOrder`, `logoUrl` 저장 누락 수정
  - UI: `--text-secondary` → `--text-muted` 8개 파일 일괄 교체
- [x] **D5 FE (2026-03-09)**: Education(학력/교육) 기능 전체 추가
  - Prisma: Education 모델 + `prisma db push`
  - API: `/api/education` CRUD (GET/POST/PUT/DELETE)
  - Admin: `EducationForm`, `EducationList`, `/admin/education` 페이지, 사이드바/탭바 메뉴 추가
  - 공개 페이지: Experience 섹션 하단 학력/교육 섹션 표시
- [x] **D6 BE (2026-03-09)**: 코드 수준 버그 점검 (이상 없음)
- [x] **D7~D9 FE (2026-03-09)**: SEO 최적화
  - `app/sitemap.ts` — 동적 sitemap (홈 + 프로젝트)
  - `app/robots.ts` — /admin/ disallow
  - `app/layout.tsx` — openGraph + twitter 메타 강화
  - `middleware.ts` → `proxy.ts` 마이그레이션 (Next.js 16 컨벤션)
- [x] **D10 (2026-03-10)**: 브라우저 테스트 + 성능 최적화 + Vercel 재배포
  - Playwright MCP로 전 페이지 테스트 완료 (홈/프로젝트/Admin CRUD)
  - `lib/prisma.ts` — production 캐싱 버그 수정 (`globalThis` 항상 캐싱)
  - API Routes: `unstable_cache`(5분) + `revalidateTag` 적용 (4개 엔티티)
  - Admin 페이지(5개): `useEffect+useState` → `useQuery+useMutation` 전환
  - `providers.tsx`: `QueryClientProvider` 추가 (staleTime 5분, gcTime 6분)
  - `npx tsc --noEmit` 에러 0건, `next build` 성공, Vercel 배포 완료

**Sprint 3 완료 ✅ (2026-03-10)**

---

## Open Questions (미결)

- 무한 스크롤 범위: Projects 섹션만 확정
- 커스텀 도메인 결정 (Sprint 3)
- Admin 인증 방식: 비밀번호 단순 환경변수 비교 (Sprint 3 D1 결정)
