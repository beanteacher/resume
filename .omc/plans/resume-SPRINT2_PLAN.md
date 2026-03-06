# SPRINT2_PLAN - Resume 프로젝트

## Sprint Goal
Sprint 1에서 구축한 기반 위에 핵심 UI 섹션을 모두 구현한다.
API 연동, 스크롤 애니메이션, 반응형 레이아웃을 완성하여
실제 포트폴리오로 공개 가능한 메인 페이지를 완성한다.

## 기간
2주 (D1 ~ D12, 작업일 기준)

---

## 포함 범위

### UI/UX (Designer)

1. **Hi-fi 시안 — 메인 페이지 전체 섹션 (D1~D3)**
   - Hero / About / Experience / Skills / Projects / Contact 섹션 PC + Mobile
   - DoD: Figma Hi-fi 완성, `uiux_designer/figma-manifests/day2-YYYY-MM-DD/` 아카이브

2. **Hi-fi 시안 — 프로젝트 상세 페이지 (D3~D5)**
   - `/projects/[id]` 페이지 PC + Mobile
   - Skills 카테고리별 숙련도 시각화 UI
   - DoD: Figma Hi-fi 완성, 아카이브

### FE (Frontend Developer)

1. **Hero 섹션 애니메이션 강화 (D2~D4)**
   - Tailwind CSS keyframes로 텍스트/버튼 stagger 진입 애니메이션
   - 스크롤 다운 인디케이터 추가
   - DoD: fade-up stagger 적용, 반응형 확인

2. **About 섹션 구현 (D4~D5)**
   - `GET /api/profile` 연동 — 이름, 타이틀, bio, 소셜 링크 표시
   - 스크롤 진입 애니메이션 (Intersection Observer + Tailwind)
   - DoD: 실데이터 렌더링, 반응형, 애니메이션 동작

3. **Experience 섹션 — 타임라인 (D5~D7)**
   - `GET /api/companies` 연동 — 회사별 기간/역할/설명
   - 버티컬 타임라인 레이아웃
   - 각 회사 카드 내 연관 프로젝트 목록 표시
   - DoD: DB 데이터 연동, 타임라인 렌더링, 스크롤 애니메이션

4. **Projects 섹션 — 무한 스크롤 그리드 (D7~D9)**
   - `GET /api/projects?cursor=&limit=6` cursor 기반 무한 스크롤
   - 프로젝트 카드: 썸네일, 제목, 기술스택 태그, 회사명
   - techStack JSON.parse 처리
   - DoD: 무한 스크롤 동작, 카드 hover 애니메이션, 반응형 2~3컬럼 그리드

5. **프로젝트 상세 페이지 `/projects/[id]` (D9~D11)**
   - `GET /api/projects/[id]` 연동
   - 동적 라우팅, OG/meta 태그 (SEO 기초)
   - 기술스택 배지, 성과 목록, GitHub/Demo 링크
   - DoD: 동적 라우팅 동작, SEO meta 태그 포함

6. **Skills 섹션 — 카테고리별 시각화 (D8~D10)**
   - `GET /api/skills` 연동
   - 카테고리(Frontend/Backend/Database/DevOps/Tool) 탭 또는 그룹
   - 숙련도(1~5) 시각화 (바 또는 아이콘 방식)
   - DoD: 카테고리 그룹핑, 숙련도 시각화, 반응형

7. **Contact 섹션 구현 (D10~D11)**
   - 이메일, GitHub, LinkedIn 링크
   - 간단한 레이아웃 (폼 없음, Sprint 3 옵션)
   - DoD: 링크 동작, 반응형

8. **반응형 레이아웃 전체 적용 (D11~D12)**
   - Mobile 375px ~ Desktop 1280px+ 전 섹션 검수
   - DoD: 모든 섹션 모바일 정상 렌더링

8. **활성 섹션 nav 하이라이트 (추가)**
   - IntersectionObserver로 현재 뷰포트 섹션 감지
   - 해당 nav 링크에 gradient 색상 적용 (PC + 모바일)
   - DoD: 스크롤 시 nav 항목 실시간 하이라이트

### PM

1. **Sprint 2 통합 검증 (D12)**
   - `npx tsc --noEmit` 에러 0건
   - `npm run build` 성공
   - 전 섹션 API 연동 확인
   - Mobile/Desktop 렌더링 확인

---

## 제외 범위
- Admin CRUD 기능 (Sprint 3)
- 배포/도메인 설정 (Sprint 3)
- SEO 전체 최적화 — meta 기초만 (sitemap, robots.txt는 Sprint 3)
- Contact 폼 (이메일 전송 기능) — Sprint 3 옵션

---

## 담당/작업 요약

| 담당 | 핵심 작업 | 산출물 |
|------|-----------|--------|
| UI/UX | Hi-fi 시안 전체 (메인 + 상세) | Figma Hi-fi 파일, 일자별 아카이브 |
| FE | 6개 섹션 구현 + 상세 페이지 + 반응형 | 컴포넌트, 페이지, API 연동 |
| PM | 통합 검증, 빌드 확인 | 빌드 성공 보고 |

---

## 의존성 흐름

```
UI/UX: Hi-fi 시안 메인 (D1~D3)
    |
    +---> FE: Hero 애니메이션 (D2~D4)
    +---> FE: About 섹션 (D4~D5)
    +---> FE: Experience 섹션 (D5~D7)
    +---> FE: Projects 섹션 (D7~D9)

UI/UX: Hi-fi 시안 상세+Skills (D3~D5)
    |
    +---> FE: Skills 섹션 (D8~D10)
    +---> FE: 프로젝트 상세 페이지 (D9~D11)

FE: Contact 섹션 (D10~D11) - 독립 작업
FE: 반응형 전체 검수 (D11~D12) → PM: 통합 검증 (D12)
```

---

## 완료 기준 (Sprint DoD)

| # | 기준 | 검증 방법 |
|---|------|-----------|
| 1 | TypeScript 타입 에러 0건 | `npx tsc --noEmit` |
| 2 | 프로덕션 빌드 성공 | `npm run build` |
| 3 | 전 섹션 API 연동 동작 | 브라우저 수동 확인 |
| 4 | 무한 스크롤 동작 | Projects 섹션 스크롤 테스트 |
| 5 | 프로젝트 상세 페이지 동작 | `/projects/1` 접근 테스트 |
| 6 | 반응형 375px Mobile 정상 | 브라우저 DevTools 확인 |
| 7 | Hi-fi Figma 아카이브 완료 | `figma-manifests/` 경로 확인 |

---

## 기술 구현 가이드 (FE)

### API 연동 패턴

```tsx
// Server Component (RSC) 방식 — 이 프로젝트는 Next.js 16 App Router
async function ExperienceSection() {
  const res = await fetch('/api/companies', { cache: 'no-store' })
  const { data } = await res.json()
  return <Timeline companies={data} />
}
```

### 무한 스크롤 패턴 (Projects)

```tsx
// Intersection Observer + useState로 cursor 관리
// cursor 기반 API: GET /api/projects?cursor={id}&limit=6
// 응답: { data: { items, nextCursor } }
```

### 스크롤 애니메이션 패턴 (Tailwind keyframes)

```tsx
// Intersection Observer로 뷰포트 진입 감지
// data-visible 속성 토글 → CSS animate-fade-up 클래스 추가
// stagger: style={{ animationDelay: `${index * 0.04}s` }}
```

### techStack/achievements 파싱

```tsx
// DB 저장 형식: JSON.stringify(['Next.js', 'TypeScript'])
// 사용 시: JSON.parse(project.techStack) as string[]
```

---

## 리스크

| # | 리스크 | 영향 | 완화책 |
|---|--------|------|--------|
| 1 | 실제 이력 데이터 미입력 | 플레이스홀더로 배포 불가 | Sprint 2 D1에 사용자 데이터 확인 |
| 2 | 무한 스크롤 UX 성능 이슈 | 스크롤 버벅임 | Intersection Observer, 이미지 lazy-load |
| 3 | Hi-fi 시안 지연 | FE 작업 시작 지연 | D3까지 메인 섹션 시안 선확정 |
| 4 | 반응형 복잡도 | D12 이후 지연 | 컴포넌트 단위로 반응형 즉시 적용 |
