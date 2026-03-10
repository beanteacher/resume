# SPRINT4 Retrospective — Resume 프로젝트

## 회고 일자
2026-03-10

---

## KPT (Keep / Problem / Try)

### Keep ✅ — 잘 된 것

1. **useInView 패턴 통일**
   - CSS `animate-[]` 혼용 → `style={{ opacity, transform }}` + transition 직접 제어로 단일화
   - SSR/CSR 불일치 문제를 근본 해결 (mounted 패턴 병행)

2. **Hydration Error 조기 발견 & 수정**
   - D1에서 바로 발견하고 수정. 이후 모든 스크린샷에서 깔끔하게 동작

3. **렌더 블로킹 폰트 최적화**
   - `@import` → `<link rel="stylesheet">` 이동이 빠르고 명확한 성능 개선

4. **Playwright MCP 활용**
   - 3개 뷰포트(1440/768/390)를 자동화 스크린샷으로 크로스 브라우저 검증
   - 모바일 메뉴, 테마 전환, 프로젝트 상세 페이지 모두 확인

5. **스프린트 속도**
   - D1~D4 전부 2026-03-10 하루에 완료 (AI 협업 효과)

---

### Problem ⚠️ — 아쉬운 점

1. **Lighthouse 점수 미측정**
   - CLI 환경 제약으로 실제 점수 수치를 캡처하지 못함
   - 렌더 블로킹 제거 등 개선은 완료했으나 정량적 증거 부재

2. **fullPage 스크린샷에서 애니메이션 미노출**
   - useInView 특성상 스크롤 없이는 opacity:0 상태로 캡처됨
   - 실제 UX 확인은 브라우저 직접 방문이 필요

3. **샘플 데이터 품질**
   - 학력/교육 섹션에 "과정/교육" 더미 데이터가 공개 페이지에 노출됨
   - Admin에서 실제 데이터 입력이 필요한 상태

---

### Try 🔄 — 다음에 시도할 것

1. **Vercel Speed Insights / Analytics 연동**
   - 실제 Lighthouse 점수를 Vercel 대시보드에서 지속 모니터링

2. **Admin 실제 데이터 입력**
   - 학력/교육 샘플 데이터 → 실제 이력으로 교체
   - 프로젝트 thumbnailUrl 실제 이미지 추가

3. **커스텀 도메인 연결**
   - 포트폴리오 사이트 완성도 ↑ (beanteacher.dev 또는 유사 도메인)

4. **Contact 폼 이메일 전송**
   - Resend 또는 EmailJS로 실제 메일 전송 기능 추가

---

## Sprint 4 최종 지표

| 지표 | 결과 |
|------|------|
| tsc --noEmit 에러 | 0건 ✅ |
| next build | 성공 ✅ |
| 콘솔 에러 (Vercel) | 0건 ✅ |
| 크리티컬 버그 | 0건 ✅ |
| 크로스 브라우저 (3개 뷰포트) | 통과 ✅ |
| 라이트/다크 모드 전환 | 정상 ✅ |
| Vercel 배포 | 완료 ✅ |

---

## 프로젝트 전체 회고

4개 Sprint를 통해 Next.js 16 + Tailwind v4 + Prisma 기반 포트폴리오를 완성했다.

- **Sprint 1**: 스캐폴딩 + 디자인 시스템 + 공통 컴포넌트
- **Sprint 2**: 공개 포트폴리오 페이지 + Vercel 배포
- **Sprint 3**: Admin CRUD + SEO + 성능 최적화
- **Sprint 4**: 애니메이션 폴리싱 + 크로스 브라우저 QA

AI 에이전트(PM·FE·UI/UX)와 협업하여 혼자 팀처럼 일하는 개발 방식이 이 프로젝트의 핵심 메시지이자 실제 구현 방식이었다. 결과물이 그 주장을 직접 증명한다.
