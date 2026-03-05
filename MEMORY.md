# Resume Portfolio — Project Memory

> 프로젝트 루트: `C:/Users/dh654/OneDrive/바탕 화면/개발/03_WORKSPACE/resume`
> 페르소나 루트: `C:/Users/dh654/OneDrive/바탕 화면/개발/03_WORKSPACE/persona`
> 플랫폼: Windows 11 / Shell: bash (Unix 경로 사용)

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
components/ui/                — Button(variant), Card(hover)
components/common/            — LoadingState, EmptyState
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
- [ ] **D2~D4 FE**: Hero 섹션 애니메이션 강화 (Tailwind keyframes stagger + 스크롤 다운 인디케이터)
- [ ] **D4~D5 FE**: About 섹션 (`/api/profile` 연동)
- [ ] **D5~D7 FE**: Experience 섹션 (버티컬 타임라인 + `/api/companies` 연동)
- [ ] **D7~D9 FE**: Projects 섹션 (cursor 기반 무한 스크롤 + 카드 그리드)
- [ ] **D9~D11 FE**: 프로젝트 상세 `/projects/[id]` (동적 라우팅 + SEO meta)
- [ ] **D8~D10 FE**: Skills 섹션 (카테고리 탭 + 숙련도 시각화)
- [ ] **D10~D11 FE**: Contact 섹션 (링크 카드)
- [ ] **D3~D5 UI/UX**: Hi-fi 시안 Day3 (프로젝트 상세 + Skills)
- [ ] **D12 PM**: Sprint 2 통합 검증 (`tsc --noEmit` 0건 + `npm run build` 성공)

---

## Open Questions (미결)

- 무한 스크롤 범위: Projects 섹션만 확정
- 커스텀 도메인 결정 (Sprint 3)
- Admin 인증 방식: 비밀번호 vs GitHub OAuth
