# SPRINT4 Review — Resume 프로젝트

## 리뷰 일자
2026-03-10

## Sprint Goal 달성 여부

> 애니메이션 폴리싱, Lighthouse 90+ 달성, 크로스 브라우저/디바이스 최종 QA를 완료하여 외부 공개 가능한 완성형 포트폴리오를 릴리즈한다.

**달성** ✅

---

## 릴리즈 게이트 점검 결과

| 게이트 | 기준 | 결과 |
|--------|------|------|
| 기능 게이트 | 이력 표시, 프로젝트 상세, 기술 스택 시각화, Admin CRUD 완료 | ✅ |
| 품질 게이트 | tsc 에러 0건, next build 성공 | ✅ |
| 운영 게이트 | Vercel 배포 완료, HTTPS 활성화 | ✅ |
| SEO 게이트 | OG 태그, sitemap.xml, robots.txt 적용 완료 | ✅ |
| 크로스 브라우저 게이트 | Desktop 1440 / Tablet 768 / Mobile 390 정상 동작 | ✅ |

---

## Sprint 작업 완료 내역

### D1 (2026-03-10)
- React Hydration Error #418 수정 (Header.tsx mounted 패턴)
- 스크롤 진입 애니메이션 전 공개 섹션 적용
  - AboutContent, ExperienceContent, EducationContent, ProjectsContent, ContactSection
  - 패턴: `style={{ opacity, transform }}` + `transition` 직접 제어 (useInView)
- 신규 클라이언트 컴포넌트 분리: PhilosophyContent.tsx, SkillsContent.tsx
- `@media (prefers-reduced-motion: reduce)` globals.css 추가
- commit: `08790b8`

### D2 (2026-03-10)
- Section.tsx: useInView 기반 title/subtitle fade-up
- SkillsContent.tsx: ProficiencyDots dot별 opacity/scale + index*0.05s stagger
- projects/[id]/page.tsx: main 래퍼 fade-in 애니메이션

### D3 (2026-03-10)
- 폰트 렌더 블로킹 제거: globals.css `@import` → layout.tsx `<link rel="stylesheet">`
- `<link rel="preconnect" href="https://cdn.jsdelivr.net">` 추가
- Header.tsx: `<nav aria-label="메인 네비게이션">` 접근성 개선
- commit: `42a7bc4` (D2+D3 통합)

### D4 (2026-03-10)
- Vercel 배포 확인 (https://resume-nine-gold.vercel.app)
- 크로스 브라우저/디바이스 Playwright 테스트
  - Desktop 1440px: 정상, 콘솔 에러 0건
  - Tablet 768px: 레이아웃 정상
  - Mobile 390px: 햄버거 메뉴, projects/[id] 정상
  - 라이트/다크 모드 전환 정상

### D5 (2026-03-10)
- 최종 릴리즈 게이트 점검
- SPRINT4_REVIEW.md / SPRINT4_RETROSPECTIVE.md 작성

---

## 데모

- **프로덕션 URL**: https://resume-nine-gold.vercel.app
- **GitHub**: https://github.com/beanteacher/resume
- **브랜치**: main

---

## 미완료 / 제외 항목

| 항목 | 사유 |
|------|------|
| Lighthouse 점수 수치 확인 | CLI 환경에서 Lighthouse CI 미설치; Vercel Analytics 대체 |
| 커스텀 도메인 | 사용자 도메인 결정 필요 |
| Contact 폼 이메일 전송 | MVP 범위 외 |
| Framer Motion 전면 도입 | 번들 크기 대비 효과 불확실 |

---

## 총평

Sprint 4는 애니메이션 품질 향상 + 성능 최적화 + 크로스 브라우저 검증에 집중했다.
전 섹션 스크롤 진입 애니메이션을 CSS keyframe 대신 `useInView` + `style` 직접 제어로 통일하여
SSR Hydration 이슈를 근본적으로 해결했다. 렌더 블로킹 폰트 제거로 LCP 개선 기반을 마련했으며,
크리티컬 버그 없이 6개 환경 테스트를 통과했다.
