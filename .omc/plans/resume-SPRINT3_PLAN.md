# SPRINT3_PLAN - Resume 프로젝트

## Sprint Goal
Admin CRUD 페이지와 SEO 최적화를 완성하여 실사용 가능한 포트폴리오 사이트를 완성한다.

## 기간
2주 (D1 ~ D10, 작업일 기준)

## 사전 완료 항목 (Sprint 2에서 선행 완료)
- [x] 3.4 기술 스택 시각화 — SkillsSection.tsx (카테고리별 숙련도 dot 시각화) ✅
- [x] 3.6 Vercel 배포 설정 — https://resume-nine-gold.vercel.app ✅
- [x] 프로젝트 상세 페이지 기본 meta 태그 ✅

---

## 포함 범위

### UI/UX (Designer) — D1~D2

1. **Admin 페이지 설계 (3.1 D1~D2)**
   - Admin 로그인 페이지 (비밀번호 입력)
   - Admin 대시보드 레이아웃 (사이드바 + 콘텐츠)
   - Company CRUD 화면 (목록/등록/수정 폼)
   - Project CRUD 화면 (목록/등록/수정 폼)
   - Skill CRUD 화면 (목록/등록/수정 폼)
   - DoD: Figma 아카이브 `uiux_designer/figma-manifests/day4-2026-03-06/` + FE handoff

### BE (Backend) — D1~D3

1. **Admin 인증 구현 (3.2 D1~D3)**
   - 인증 방식: 환경변수 기반 비밀번호 (ADMIN_PASSWORD) — 단순 포트폴리오용
   - `middleware.ts`: `/admin/*` 경로 쿠키 검증 → 미인증 시 `/admin/login` 리다이렉트
   - `app/api/admin/login/route.ts`: POST — ADMIN_PASSWORD 검증 + HttpOnly 쿠키 발급
   - `app/api/admin/logout/route.ts`: POST — 쿠키 삭제
   - CRUD API 추가:
     - `app/api/companies/route.ts` POST (회사 등록)
     - `app/api/companies/[id]/route.ts` PUT/DELETE (수정/삭제)
     - `app/api/projects/route.ts` POST (프로젝트 등록)
     - `app/api/projects/[id]/route.ts` PUT/DELETE (수정/삭제)
     - `app/api/skills/route.ts` POST (스킬 등록)
     - `app/api/skills/[id]/route.ts` PUT/DELETE (수정/삭제)
   - DoD: 인증 미들웨어 동작, CRUD API TypeScript 에러 0건

### FE (Frontend Developer) — D3~D9

1. **Admin CRUD 페이지 구현 (3.3 D3~D7)**
   - `app/admin/login/page.tsx` — 로그인 폼
   - `app/admin/page.tsx` — 대시보드 (Company/Project/Skill 요약)
   - `app/admin/companies/page.tsx` — 회사 목록 + 등록/수정/삭제
   - `app/admin/projects/page.tsx` — 프로젝트 목록 + 등록/수정/삭제
   - `app/admin/skills/page.tsx` — 스킬 목록 + 등록/수정/삭제
   - Admin 레이아웃: 사이드바 네비게이션
   - DoD: 전체 CRUD 동작, TypeScript 에러 0건

   **D3 완료 내역 (2026-03-09)**
   - ✅ UI 컴포넌트 신규: `Input.tsx` (textarea 지원), `Badge.tsx`, `Select.tsx`
   - ✅ Admin 컴포넌트 신규: `AdminSidebar`, `AdminTabBar`, `CompanyForm/List`, `ProjectForm/List`, `SkillForm/List`
   - ✅ Admin 페이지 전체 구현: layout, login, dashboard, companies, projects, skills
   - ✅ `Select.tsx` UI 개선 (Codex 작업): 네이티브 `<select>` → 완전한 커스텀 드롭다운으로 대체
     - 숨겨진 `<select>`로 폼 호환성 유지 (name/value/onChange 정상 동작)
     - 커스텀 버튼 트리거 + chevron SVG (열림 시 180° 회전 애니메이션)
     - 커스텀 listbox 드롭다운 (z-index, shadow, 선택 항목 퍼플 하이라이트)
     - controlled/uncontrolled 모드 모두 지원 (`useId`, `useState`, `useMemo`)
     - 외부 클릭 시 닫힘 (`mousedown` 이벤트 리스너)
     - ARIA 속성 완비 (`aria-haspopup`, `aria-expanded`, `aria-controls`, `role="listbox/option"`)
   - ✅ `npx tsc --noEmit` 에러 0건, `npm run build` 성공

   **D4 완료 내역 (2026-03-09)**
   - ✅ API 누락 필드 수정 (버그 수정)
     - `POST/PUT /api/projects`: `thumbnailUrl` 저장 누락 수정
     - `POST/PUT /api/skills`: `iconUrl`, `sortOrder` 저장 누락 수정
     - `POST /api/companies`: 불필요한 `techStack` 타입 제거, `logoUrl` 저장 추가
   - ✅ UI 버그 수정
     - `Input.tsx` placeholder: `--text-secondary`(미정의 변수) → `--text-muted` + `opacity-50`로 교체
     - `Select.tsx` placeholder: 미선택 상태 텍스트 동일 변수 문제 수정 예정
   - ✅ `npx tsc --noEmit` 에러 0건

   **D5 완료 내역 (2026-03-09)**
   - ✅ `--text-secondary` 미정의 변수 전체 교체 (8개 파일 → `--text-muted`)
     - AdminSidebar, AdminTabBar, CompanyList, ProjectList, SkillList, Input(helperText), Select, admin/page
   - ✅ Education(학력/교육) 기능 전체 추가
     - Prisma: `Education` 모델 추가 (`name`, `course`, `type`, `startDate`, `endDate`, `isCurrent`, `description`)
     - DB: `prisma db push`로 Education 테이블 생성
     - Types: `SerializedEducation` 타입 추가
     - API: `/api/education` CRUD (GET/POST/PUT/DELETE) — `app/api/education/route.ts`, `[id]/route.ts`
     - Admin: `EducationForm.tsx`, `EducationList.tsx`, `app/admin/education/page.tsx`
     - Admin: `AdminSidebar` / `AdminTabBar`에 🎓 학력/교육 메뉴 추가
     - 공개 페이지: `EducationSection.tsx`(서버), `EducationContent.tsx`(클라이언트) 신규
     - 공개 페이지: `app/page.tsx` Experience 섹션 하단에 `<EducationSection />` 추가
   - ✅ `npx tsc --noEmit` 에러 0건

2. **SEO 최적화 (3.5 D7~D9)**
   - `app/sitemap.ts` — Next.js 빌트인 sitemap 생성
   - `app/robots.ts` — robots.txt 생성
   - `app/layout.tsx` — OG 태그 강화 (og:image, og:url, og:site_name)
   - DoD: sitemap.xml 접근 가능, robots.txt 접근 가능, OG 태그 완성

### PM — D10

1. **Sprint 3 통합 검증 (3.8 D10)**

   **사전 준비**
   - [ ] `git push origin main` → Vercel 재배포 완료 확인
   - [ ] `npx tsc --noEmit` 에러 0건
   - [ ] `npm run build` 성공

   **Playwright MCP 자동화 테스트**
   - [ ] Admin 인증
     - `/admin` 직접 접속 → `/admin/login` 리다이렉트 확인
     - 비밀번호 입력 → 로그인 성공 → 대시보드 이동 확인
     - 로그아웃 → 로그인 페이지 복귀 확인
   - [ ] Company CRUD
     - 회사 등록 (폼 입력 → 저장 → 목록 반영 확인)
     - 회사 수정 (기존 항목 수정 → 저장)
     - 회사 삭제 (목록에서 제거 확인)
   - [ ] Project CRUD
     - 프로젝트 등록 → 저장 → `/projects/[id]` 공개 페이지 내용 확인
     - 수정 / 삭제
   - [ ] Skill CRUD
     - 스킬 등록 / 수정 / 삭제
   - [ ] Education CRUD
     - 학력/교육 등록 → 저장 → 공개 페이지 Experience 섹션 표시 확인
     - 수정 / 삭제
   - [ ] SEO 파일
     - `https://resume-nine-gold.vercel.app/sitemap.xml` 접근 → XML 구조 확인
     - `https://resume-nine-gold.vercel.app/robots.txt` 접근 → `Disallow: /admin/` 확인
   - [ ] OG 태그
     - 홈(`/`) `<head>` 내 `og:title`, `og:description`, `og:site_name` 존재 확인

   **완료 처리**
   - [ ] MEMORY.md Sprint 3 완료 ✅ 업데이트
   - [ ] Sprint 3 Done 선언

---

## D1 (오늘) 작업 계획

| 담당 | 작업 | 산출물 |
|------|------|--------|
| UI/UX | Admin 전체 화면 설계 + Figma 아카이브 day4 | `figma-manifests/day4-2026-03-06/` |
| BE | Admin 인증 미들웨어 + CRUD API Routes | `middleware.ts`, `app/api/admin/`, CRUD API |

> FE는 D3부터 합류 (UI/UX 설계 + BE 인증 완료 후)

---

## 제외 범위
- 3.7 커스텀 도메인 — 사용자 도메인 결정 후 별도 진행
- Contact 폼 (이메일 전송) — 미정

---

## 완료 기준 (Sprint DoD)

| # | 기준 | 검증 방법 |
|---|------|-----------|
| 1 | TypeScript 타입 에러 0건 | `npx tsc --noEmit` |
| 2 | 프로덕션 빌드 성공 | `npm run build` |
| 3 | Admin 로그인/로그아웃 동작 | `/admin/login` 수동 테스트 |
| 4 | Company/Project/Skill CRUD 동작 | Admin 페이지 수동 테스트 |
| 5 | sitemap.xml 접근 가능 | `/sitemap.xml` 브라우저 확인 |
| 6 | robots.txt 접근 가능 | `/robots.txt` 브라우저 확인 |
| 7 | OG 태그 완성 | HTML head 확인 |
| 8 | Hi-fi Figma 아카이브 완료 | `figma-manifests/day4-*/` 경로 확인 |

---

## 의존성 흐름

```
UI/UX: Admin 설계 (D1~D2)
    |
    +---> FE: Admin 로그인 페이지 (D3~D4)
    +---> FE: Admin 대시보드 + CRUD (D4~D7)

BE: Admin 인증 미들웨어 (D1~D3)
    |
    +---> FE: Admin 로그인 연동 (D3~D4)

BE: CRUD API Routes (D2~D3)
    |
    +---> FE: Admin CRUD 페이지 (D4~D7)

FE: Admin CRUD 완료 → FE: SEO 최적화 (D7~D9) → PM: 통합 검증 (D10)
```

---

## 리스크

| # | 리스크 | 영향 | 완화책 |
|---|--------|------|--------|
| 1 | ADMIN_PASSWORD .env 누락 | Admin 접근 불가 | Vercel 환경변수에도 반드시 추가 안내 |
| 2 | middleware.ts Next.js 16 호환성 | 인증 우회 | Next.js 공식 middleware 패턴 준수 |
| 3 | Admin UI 복잡도 증가 | D7 초과 | 최소 기능 우선 (폼 + 목록만, 이미지 업로드 제외) |
