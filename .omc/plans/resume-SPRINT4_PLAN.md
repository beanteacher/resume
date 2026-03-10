# SPRINT4_PLAN - Resume 프로젝트

## Sprint Goal

애니메이션 폴리싱, Lighthouse 90+ 달성, 크로스 브라우저/디바이스 최종 QA를 완료하여 외부 공개 가능한 완성형 포트폴리오를 릴리즈한다.

## 기간

1주 (D1 ~ D5, 작업일 기준)

---

## 사전 완료 항목 (Sprint 3에서 선행 완료)

- [x] Admin CRUD (Company / Project / Skill / Education) ✅
- [x] SEO 최적화 (sitemap.ts, robots.ts, OG 태그) ✅
- [x] Vercel 배포 (https://resume-nine-gold.vercel.app) ✅
- [x] 성능 기반 (unstable_cache 5분 + revalidateTag) ✅
- [x] 클라이언트 상태 (useQuery / useMutation 전환) ✅
- [x] Playwright MCP 전 페이지 수동 테스트 ✅
- [x] tsc --noEmit 에러 0건, npm run build 성공 ✅

---

## 포함 범위

### FE (Frontend Developer) — D1~D4

#### 4.1 애니메이션 세부 조정 (D1~D3)

**D1 완료 내역 (2026-03-10)**
- ✅ React Hydration Error #418 수정
  - 원인: `Header.tsx`에서 `useTheme()` SSR 불일치 (서버: undefined, 클라이언트: 'dark')
  - 수정: `mounted` state 추가 → 마운트 전 테마 버튼 고정값(`☀️`) 사용
- ✅ 스크롤 진입 애니메이션 전 공개 섹션 적용
  - 패턴 통일: CSS `animate-[fade-up]` 제거 → `style={{ opacity, transform }}` + `transition` 직접 제어
  - `AboutContent.tsx`: `animate+transition` 혼용 → 올바른 패턴으로 교체
  - `ExperienceContent.tsx`: CSS animation + opacity 충돌 → stagger transition 직접 제어
  - `EducationContent.tsx`: ExperienceContent와 동일 패턴 적용
  - `ProjectsContent.tsx`: ProjectCard에 `useInView` + stagger 추가
  - `ContactSection.tsx`: ContactCard별 `useInView` + stagger 적용
- ✅ 신규 클라이언트 컴포넌트 분리
  - `PhilosophyContent.tsx`: `page.tsx` 인라인 → 클라이언트 분리, 카드 4개 stagger
  - `SkillsContent.tsx`: `SkillsSection.tsx` 서버 유지, 렌더링 로직 클라이언트 분리
- ✅ `@media (prefers-reduced-motion: reduce)` globals.css 추가
- ✅ Playwright MCP 전 섹션 시각 검증 완료 (s4-01~s4-07 스크린샷)
- ✅ tsc --noEmit 에러 0건, npm run build 성공
- ✅ git commit & push (08790b8)


**D3 완료 내역 (2026-03-10)**
- ✅ 애니메이션 시각 검증: Hero/Skills/projects/[id] Playwright 스크린샷 확인
  - Hero fade-up, Skills 섹션 제목 fade-in + dot 순차 등장, projects/[id] main fade-in 모두 정상
- ✅ Lighthouse 최적화:
  - 폰트: globals.css `@import url(CDN)` 제거 → layout.tsx `<head>` `<link rel="stylesheet">` 이동 (렌더 블로킹 제거)
  - 폰트 preconnect: `<link rel="preconnect" href="https://cdn.jsdelivr.net">` 추가
  - 접근성: `<nav aria-label="메인 네비게이션">` 추가 (Header.tsx)
- ✅ tsc --noEmit 에러 0건, next build 성공

**D2 완료 내역 (2026-03-10)**
- ✅ Section.tsx 섹션 제목 fade-in: `'use client'` + `useInView` → 스크롤 진입 시 title/subtitle fade-up
- ✅ SkillsContent.tsx ProficiencyDots 순차 등장: dot별 `opacity`/`scale` + `index * 0.05s` delay
- ✅ projects/[id]/page.tsx `<main>` 래퍼 fade-in: `animate-[fade-in_0.4s_ease_both]` 추가
- ✅ tsc --noEmit 에러 0건, next build 성공

**목표**: 공개 페이지 전체 인터랙션을 부드럽게 정제한다. 성능 저하 없이 체감 UX 향상.

**작업 항목**:

1. **Framer Motion 도입 여부 점검**
   - 현재 CSS keyframes(slide-down, fade-in, fade-up)만 사용 중
   - Framer Motion이 없다면 추가 도입 여부 결정 → 규모 대비 CSS animation 유지 권장 (번들 크기 고려)
   - 결론: CSS animation 기반 유지, Framer Motion은 스크롤 진입 애니메이션에만 제한적 적용

2. **스크롤 진입 애니메이션 적용 (Intersection Observer)**
   - `HeroSection`: 타이핑/페이드인 효과 정제
   - `ExperienceSection`: 타임라인 카드 순차 fade-up (stagger 0.1s)
   - `SkillsSection`: 카테고리별 숙련도 dot 순차 등장
   - `EducationSection`: 카드 fade-up
   - `ProjectsSection`: 카드 그리드 stagger fade-up

3. **페이지 전환 애니메이션**
   - `/projects/[id]` 진입 시 fade-in
   - 뒤로가기 시 slide-out (브라우저 네이티브 Back/Forward Cache 고려)

4. **Admin 페이지 제외**: Admin은 폴리싱 대상 아님

**DoD**: 전 공개 페이지 스크롤 진입 시 자연스러운 애니메이션, 성능 저하 없음 (FPS 60 유지)

---

#### 4.2 Lighthouse 성능 최적화 (D3~D4)

**목표**: Lighthouse Performance / Accessibility / SEO / Best Practices 각 90+

**작업 항목**:

1. **Lighthouse 측정 (기준선 확보)**
   - 홈(`/`), 프로젝트 상세(`/projects/[id]`) 각각 측정
   - 점수 기록 후 개선 대상 식별

2. **Performance 최적화 (예상 개선 항목)**
   - Next.js `<Image>` 컴포넌트: `priority` 속성 (Hero 이미지/LCP 대상)
   - 이미지 미사용 시: `width`/`height` 명시로 CLS 방지
   - 폰트: `next/font` 또는 `font-display: swap` 확인
   - 미사용 JS 제거: dynamic import 검토 (heavy 컴포넌트)
   - Tailwind purge 확인 (Next.js build 시 자동 처리 여부)

3. **Accessibility 최적화**
   - 버튼/링크 `aria-label` 누락 점검
   - 색상 대비(contrast ratio) 4.5:1 이상 확인
   - 이미지 `alt` 속성 전수 점검
   - 포커스 순서 논리적 확인 (Tab 키 탐색)
   - Skip Navigation 링크 추가 검토

4. **SEO 추가 점검**
   - 각 페이지 `<title>` / `<meta description>` 고유값 확인
   - structured data (JSON-LD) 추가 검토 (Person / Portfolio)
   - Canonical URL 설정 확인

5. **Best Practices**
   - HTTPS 강제 (Vercel 기본 제공 확인)
   - Console 에러/경고 0건
   - Deprecated API 사용 여부 점검

**DoD**: Lighthouse Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90, Best Practices ≥ 90

---

### PM + FE — D4~D5

#### 4.3 크로스 브라우저/디바이스 테스트

**목표**: 주요 브라우저 + 디바이스에서 UI 깨짐/기능 오류 없음 확인

**테스트 매트릭스**:

| 환경 | 브라우저 | 해상도 |
|------|----------|--------|
| Desktop | Chrome (최신) | 1440px |
| Desktop | Edge (최신) | 1440px |
| Desktop | Firefox (최신) | 1440px |
| Mobile | Chrome Mobile | 390px (iPhone 14) |
| Mobile | Safari (시뮬레이터) | 390px |
| Tablet | Chrome | 768px |

**점검 페이지**:
- `/` (홈 — Hero / About / Experience / Skills / Education / Projects)
- `/projects/[id]` (프로젝트 상세)

**점검 항목**:
- [ ] 레이아웃 깨짐 없음
- [ ] 애니메이션 정상 동작
- [ ] 폰트 렌더링 정상
- [ ] 스크롤 버벅임 없음
- [ ] 링크/버튼 터치 영역 44px 이상 (모바일)
- [ ] 다크/라이트 모드 전환 정상 (다크 기본값 유지)

**Playwright MCP 활용**: 가능한 경우 자동화 스크린샷으로 비교

**DoD**: 6개 환경 모두 주요 기능 정상 동작 확인, 크리티컬 버그 0건

---

### PM — D5

#### 4.4 최종 릴리즈

**목표**: 모든 게이트 통과 후 프로덕션 릴리즈 선언

**릴리즈 게이트 점검**:

| 게이트 | 기준 | 담당 |
|--------|------|------|
| 기능 게이트 | 이력 표시, 프로젝트 상세, 기술 스택 시각화, Admin CRUD 완료 | FE |
| 품질 게이트 | tsc 에러 0건, next build 성공, Lighthouse 각 90+ | FE |
| 운영 게이트 | Vercel 배포 완료, HTTPS 활성화 | FE |
| SEO 게이트 | OG 태그, sitemap.xml, robots.txt 적용 완료 | FE |
| 크로스 브라우저 게이트 | 6개 환경 정상 동작 확인 | PM+FE |

**릴리즈 산출물**:
- [ ] SPRINT4_REVIEW.md 작성
- [ ] SPRINT4_RETROSPECTIVE.md 작성
- [ ] MEMORY.md Sprint 4 완료 ✅ 업데이트
- [ ] (선택) 커스텀 도메인 연결 — 사용자 결정 후 진행

**DoD**: 모든 릴리즈 게이트 통과, 프로덕션 사이트 최종 확인

---

## 제외 범위

| 항목 | 사유 |
|------|------|
| 커스텀 도메인 연결 | 사용자 도메인 결정 필요 → 별도 진행 |
| Contact 폼 (이메일 전송) | 초기 MVP 범위 외 |
| Framer Motion 전면 도입 | 번들 크기 증가 대비 효과 불확실 |
| i18n (다국어) | 범위 외 |
| 다크/라이트 모드 토글 UI 추가 | Sprint 3에서 다크 기본값 확정, Sprint 4 불포함 |

---

## D1 작업 계획 (킥오프 당일)

| 담당 | 작업 | 산출물 |
|------|------|--------|
| FE | 공개 페이지 애니메이션 감사 — 현재 구현 현황 파악 | 현황 보고 |
| FE | Lighthouse 기준선 측정 (홈 + 프로젝트 상세) | 점수 스크린샷 |
| FE | 스크롤 진입 애니메이션 구현 시작 (HeroSection, ExperienceSection) | 컴포넌트 수정 |

---

## 일정 요약

| Day | 주요 마일스톤 |
|-----|--------------|
| D1 | 애니메이션 현황 감사 + Lighthouse 기준선 측정 + Hero/Experience 애니메이션 |
| D2 | Skills/Education/Projects 스크롤 애니메이션 + 페이지 전환 |
| D3 | 애니메이션 완료 검증 → Lighthouse 최적화 시작 (Performance/A11y) |
| D4 | Lighthouse 90+ 달성 확인 + 크로스 브라우저 테스트 |
| D5 | 최종 릴리즈 게이트 점검 + 릴리즈 선언 |

---

## 완료 기준 (Sprint DoD)

| # | 기준 | 검증 방법 |
|---|------|-----------|
| 1 | TypeScript 타입 에러 0건 | `npx tsc --noEmit` |
| 2 | 프로덕션 빌드 성공 | `npm run build` |
| 3 | Lighthouse Performance ≥ 90 | Lighthouse CI 또는 Chrome DevTools |
| 4 | Lighthouse Accessibility ≥ 90 | Lighthouse CI 또는 Chrome DevTools |
| 5 | Lighthouse SEO ≥ 90 | Lighthouse CI 또는 Chrome DevTools |
| 6 | Lighthouse Best Practices ≥ 90 | Lighthouse CI 또는 Chrome DevTools |
| 7 | 공개 페이지 스크롤 진입 애니메이션 적용 | 브라우저 육안 확인 |
| 8 | 크로스 브라우저 6개 환경 주요 기능 정상 | 테스트 결과 기록 |
| 9 | Vercel 프로덕션 배포 최신 상태 | https://resume-nine-gold.vercel.app |

---

## 리스크

| # | 리스크 | 영향 | 완화책 |
|---|--------|------|--------|
| 1 | Lighthouse Performance 70대 (LCP, CLS 이슈) | 목표 미달 | Next.js Image priority + 폰트 최적화 우선 적용 |
| 2 | CSS animation 성능 저하 (모바일) | UX 품질 저하 | `will-change`, `transform` 사용, `@media (prefers-reduced-motion)` 대응 |
| 3 | Safari CSS 호환성 이슈 | 특정 브라우저 깨짐 | D4 크로스 브라우저 테스트에서 조기 발견 후 D5 전 수정 |
| 4 | Lighthouse SEO 이미 90+ (Sprint 3 완료) | 중복 작업 | D1 Lighthouse 측정 후 이미 달성 항목 제외, 미달 항목에 집중 |

---

## 의존성 흐름

```
FE: 애니메이션 감사 + 기준선 측정 (D1)
    |
    +---> FE: 스크롤 진입 애니메이션 전체 (D1~D3)
    +---> FE: Lighthouse 최적화 (D3~D4)
              |
              +---> PM+FE: 크로스 브라우저 테스트 (D4~D5)
                           |
                           +---> PM: 최종 릴리즈 선언 (D5)
```
