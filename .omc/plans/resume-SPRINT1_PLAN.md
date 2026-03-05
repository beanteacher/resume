# SPRINT1_PLAN - Resume 프로젝트

## Sprint Goal
Resume 프로젝트의 기술 기반을 완성하고, 디자인 시스템을 확정하여 Sprint 2 UI 구현이 즉시 시작 가능한 상태를 만든다.

## 기간
2주 (D1 ~ D10, 작업일 기준)

---

## 포함 범위

### BE (Backend Developer)
1. **Prisma 스키마 설계 + 마이그레이션**
   - Company (회사 정보): name, role, period, description, logo
   - Project (프로젝트): title, description, techStack[], achievements[], thumbnailUrl, company 관계
   - Skill (기술 스택): name, category, proficiency, iconUrl
   - Profile (프로필 정보): name, title, bio, contact, socialLinks
   - DoD: `npx prisma migrate dev` 성공, 4개 테이블 생성 확인

2. **시드 데이터 작성**
   - 사용자 실제 이력 기반 시드 데이터 (최소 5건)
   - DoD: `npx prisma db seed` 성공, 데이터 조회 가능

3. **API Routes 구현**
   - `GET /api/profile` -- 프로필 정보
   - `GET /api/companies` -- 회사 목록 (프로젝트 포함)
   - `GET /api/projects` -- 프로젝트 목록 (페이지네이션/무한스크롤용 cursor)
   - `GET /api/projects/[id]` -- 프로젝트 상세
   - `GET /api/skills` -- 기술 스택 목록
   - DoD: 각 API 정상 응답, TypeScript 타입 안전

### FE (Frontend Developer)
1. **Next.js 프로젝트 스캐폴딩**
   - Next.js 14 + TypeScript (strict) + Tailwind CSS + App Router
   - ESLint + Prettier 설정
   - 폴더 구조: app/, components/ui/, components/sections/, lib/, types/
   - DoD: `npx tsc --noEmit` 0건, `npm run build` 성공

2. **tailwind.config.ts 디자인 토큰 반영**
   - UI/UX가 확정한 컬러/폰트/스페이싱 반영
   - globals.css 기본 스타일 설정
   - DoD: 디자인 토큰 100% 반영

3. **공통 컴포넌트 구현**
   - Header (네비게이션, 로고, 다크/라이트 모드 토글)
   - Footer (소셜 링크, 저작권)
   - Layout (공통 레이아웃 래퍼)
   - Section (섹션 래퍼 -- 타이틀 + 컨텐츠)
   - Button, Card (기본 UI 원자 컴포넌트)
   - DoD: named export, Props 타입 정의, 반응형 기본 적용

### UI/UX (Designer)
1. **디자인 시스템 확정**
   - 컬러 팔레트 (라이트/다크 모드)
   - 타이포그래피 스케일 (Pretendard 기반)
   - 스페이싱 시스템 (8px grid)
   - 기본 컴포넌트 스타일 (Button, Card, Input)
   - DoD: Figma Design System 파일 완성, design-tokens.md 작성

2. **와이어프레임 Lo-fi**
   - 메인 페이지 (Hero + About + Experience + Skills + Projects + Contact)
   - 프로젝트 상세 페이지
   - Admin 페이지 (간략 Lo-fi)
   - DoD: PC + Mobile 와이어프레임 완성, 사용자 동선 표현

### PM
1. **GitHub 저장소 초기화** (사용자 승인 후)
   - 기존 repo 내용 초기화
   - branch 전략 설정 (main + develop + feature/*)
   - .gitignore, README.md 초기 작성
   - DoD: repo clone 및 develop 브랜치 생성 완료

2. **Sprint 1 통합 검증**
   - tsc --noEmit 에러 0건
   - npm run build 성공
   - API 엔드포인트 응답 정상

---

## 제외 범위
- 실제 UI 페이지 구현 (Sprint 2)
- Admin CRUD 기능 (Sprint 3)
- 배포/도메인 설정 (Sprint 3)
- 애니메이션/인터랙션 (Sprint 2~4)

---

## 담당/작업 요약

| 담당 | 핵심 작업 | 산출물 |
|------|-----------|--------|
| PM | 저장소 초기화, 일정 관리, 통합 검증 | 초기화된 repo, 빌드 성공 보고 |
| BE | DB 스키마, 시드 데이터, API Routes | schema.prisma, seed.ts, API 엔드포인트 |
| FE | 프로젝트 스캐폴딩, 디자인 토큰, 공통 컴포넌트 | Next.js 프로젝트, tailwind.config.ts, 공통 컴포넌트 |
| UI/UX | 디자인 시스템, 와이어프레임 | Figma 파일, design-tokens.md |

---

## 의존성 흐름

```
PM: 저장소 초기화 (D1)
    |
    +---> FE: 프로젝트 스캐폴딩 (D1~D2)
    |         |
    |         +---> FE: 디자인 토큰 반영 (D4~D5) <--- UI/UX: 디자인 시스템 (D1~D4)
    |         |
    |         +---> FE: 공통 컴포넌트 (D5~D7) <--- UI/UX: 디자인 시스템
    |
    +---> BE: Prisma 스키마 (D1~D3)
              |
              +---> BE: 시드 데이터 (D3~D4)
              |
              +---> BE: API Routes (D4~D6)

UI/UX: 디자인 시스템 (D1~D4) ---> 와이어프레임 (D4~D7)
```

---

## 완료 기준 (Sprint DoD)

| # | 기준 | 검증 방법 |
|---|------|-----------|
| 1 | TypeScript 타입 에러 0건 | `npx tsc --noEmit` |
| 2 | 프로덕션 빌드 성공 | `npm run build` |
| 3 | DB 마이그레이션 성공 | `npx prisma migrate dev` |
| 4 | 시드 데이터 입력 성공 | `npx prisma db seed` |
| 5 | API 엔드포인트 정상 응답 | 각 GET API 수동 테스트 |
| 6 | 디자인 시스템 문서화 완료 | design-tokens.md 존재 + Figma URL 유효 |
| 7 | 와이어프레임 Lo-fi 완성 | Figma 파일 URL 유효, PC+Mobile 포함 |

---

## 리스크

| # | 리스크 | 영향 | 완화책 |
|---|--------|------|--------|
| 1 | 이력 데이터 구조 변경 | 스키마 재설계 필요 | D3까지 사용자 확인 후 확정 |
| 2 | 디자인 방향 미합의 | FE 공통 컴포넌트 지연 | D4까지 디자인 시스템 선확정 |
| 3 | GitHub 초기화 승인 지연 | 전체 작업 시작 불가 | 킥오프 단계에서 즉시 승인 요청 |
