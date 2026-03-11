# SPRINT6_PLAN - Resume 프로젝트

## Sprint Goal

Admin에 프로필 관리 페이지(`/admin/profile`)를 신규 구현하여 이름·직함·자기소개·연락처 등 모든 프로필 데이터를 UI에서 수정할 수 있도록 하고, 로그인 페이지의 하드코딩된 이름("오민성")을 DB에서 동적으로 읽어오도록 교체한다.

## 기간

1일 (2026-03-11)

---

## 현황 분석

### 문제점

| 위치 | 내용 |
|------|------|
| `app/admin/login/page.tsx:45` | "오민성" 하드코딩 |
| Admin 내비게이션 | Profile 메뉴 항목 없음 |
| `app/api/admin/` | Profile PUT 엔드포인트 없음 |

### 기존 자산 (재활용 가능)

| 자산 | 상태 |
|------|------|
| `prisma/schema.prisma` — `Profile` 모델 | ✅ 완비 (name, title, bio, email, phone, location, github, linkedin, blog, avatarUrl) |
| `app/api/profile/route.ts` | ✅ GET 존재 (공개 API) |
| `components/admin/` — Form/List 패턴 | ✅ CompanyForm 등 동일 구조 재사용 |
| `components/admin/AdminSidebar.tsx` | 메뉴 항목 추가 필요 |
| `components/admin/AdminTabBar.tsx` | 탭 항목 추가 필요 |

---

## 포함 범위

### 6.1 Admin Profile API 엔드포인트

**목표**: Admin 전용 프로필 수정 PUT 엔드포인트 신규 추가

**작업 내역**:
- `app/api/admin/profile/route.ts` 신규 생성
  - `GET`: 현재 프로필 조회 (`prisma.profile.findFirst()`)
  - `PUT`: 프로필 수정 (`prisma.profile.upsert`)
    - 인증 미들웨어: `cookies().get('admin_token')` 검증 → 401 반환
    - 요청 body: `{ name, title, bio, email, phone?, location, github, linkedin?, blog?, avatarUrl? }`
    - 응답: `ApiResponse<Profile>`
    - `revalidateTag('profile')` 호출 (공개 페이지 캐시 갱신)

**DoD**: `PUT /api/admin/profile` 호출 시 DB 업데이트 + 공개 페이지 SSR 캐시 무효화

---

### 6.2 ProfileForm 컴포넌트

**목표**: 프로필 전체 필드를 편집할 수 있는 폼 컴포넌트

**작업 내역**:
- `components/admin/ProfileForm.tsx` 신규 생성
  - 기존 `CompanyForm.tsx` 패턴 동일하게 적용 (React Query mutation, 에러 메시지 파싱)
  - **필드 구성**:

    | 필드 | 타입 | 필수 | 비고 |
    |------|------|------|------|
    | name | text | ✅ | 이름 |
    | title | text | ✅ | 직함 (예: Backend Developer) |
    | bio | textarea | ✅ | 자기소개 (최소 10자) |
    | email | email | ✅ | 이메일 |
    | phone | text | — | 전화번호 |
    | location | text | ✅ | 위치 |
    | github | url | ✅ | GitHub URL |
    | linkedin | url | — | LinkedIn URL |
    | blog | url | — | 블로그 URL |
    | avatarUrl | url | — | 프로필 이미지 URL |

  - `useQuery(['profile'])` → `/api/admin/profile` GET으로 초기값 로드
  - `useMutation` → `PUT /api/admin/profile`
  - 저장 성공 시: `invalidateQueries(['profile'])` + 성공 토스트/메시지
  - 저장 실패 시: `errors.submit`에 서버 에러 메시지 표시

**DoD**: 폼 저장 성공 시 화면에 즉시 반영, 에러 시 폼 하단 메시지 표시

---

### 6.3 Admin Profile 페이지

**목표**: `/admin/profile` 라우트 신규 추가

**작업 내역**:
- `app/admin/profile/page.tsx` 신규 생성
  ```tsx
  import { AdminPageTitle } from '@/components/admin/AdminPageTitle'
  import { ProfileForm } from '@/components/admin/ProfileForm'

  export default function AdminProfilePage() {
    return (
      <div>
        <AdminPageTitle title="프로필" />
        <ProfileForm />
      </div>
    )
  }
  ```

**DoD**: `/admin/profile` 접근 시 프로필 수정 폼 렌더링

---

### 6.4 Admin 내비게이션 Profile 항목 추가

**목표**: Sidebar와 TabBar에 Profile 메뉴 추가

**작업 내역**:
- `components/admin/AdminSidebar.tsx` 수정
  - `menuItems` 배열 맨 앞에 추가:
    ```ts
    { href: '/admin/profile', label: '프로필', icon: UserCircle }
    ```
  - `lucide-react`에서 `UserCircle` import

- `components/admin/AdminTabBar.tsx` 수정
  - `tabs` 배열 맨 앞에 추가:
    ```ts
    { href: '/admin/profile', label: '프로필', icon: UserCircle }
    ```
  - 모바일 탭 5개 → 대시보드는 내비게이션 유지 (5개 이내로 구성 검토)

**DoD**: PC/모바일 내비게이션에서 "프로필" 항목으로 `/admin/profile` 이동 가능

---

### 6.5 로그인 페이지 하드코딩 이름 제거

**목표**: `app/admin/login/page.tsx`의 "오민성" 하드코딩을 DB 프로필로 교체

**작업 내역**:
- `app/admin/login/page.tsx` 수정
  - `useEffect` + `fetch('/api/profile')` 로 이름 동적 로드
  - 로딩 중: `<span className="animate-pulse bg-[var(--surface)] rounded w-16 h-6 inline-block" />`
  - 로드 완료: `<h1>{profile.name}</h1>`
  - 실패 시: 빈 문자열 또는 "Admin" 폴백

**DoD**: 로그인 페이지에 하드코딩 문자열 없음, DB `profile.name` 표시

---

## 파일 변경 목록

| 파일 | 변경 유형 | 내용 |
|------|-----------|------|
| `app/api/admin/profile/route.ts` | **신규** | GET(조회) + PUT(수정) 엔드포인트, 인증 검증 |
| `components/admin/ProfileForm.tsx` | **신규** | 프로필 전체 필드 편집 폼 (React Query) |
| `app/admin/profile/page.tsx` | **신규** | `/admin/profile` 라우트 페이지 |
| `components/admin/AdminSidebar.tsx` | 수정 | Profile 메뉴 항목 추가 (UserCircle 아이콘) |
| `components/admin/AdminTabBar.tsx` | 수정 | Profile 탭 항목 추가 |
| `app/admin/login/page.tsx` | 수정 | 하드코딩 "오민성" → `/api/profile` 동적 로드 |

---

## 기술 의사결정 (ADR)

### ADR-1: Admin 전용 Profile API 경로 분리

**결정**: 기존 `/api/profile` GET은 유지하고, Admin 수정은 `/api/admin/profile` PUT으로 분리

**이유**:
- 기존 `/api/profile` GET은 공개 API로 미들웨어 불필요
- Admin 전용 수정 경로를 `/api/admin/` 하위에 배치하여 인증 체계 일관성 유지
- 향후 미들웨어 확장 시 `/api/admin/**` 단일 패턴으로 보호 가능

### ADR-2: 로그인 페이지 이름 로딩 방식

**결정**: `useEffect` + `fetch` 클라이언트 사이드 로드 (SSR 대신)

**이유**:
- 로그인 페이지는 `'use client'` 컴포넌트이며 인증 전 단계
- 서버 컴포넌트로 변환 시 form state 관리 복잡도 증가
- 이름 표시는 시각적 피드백 목적이며 SEO 불필요

### ADR-3: ProfileForm은 Create 없이 Update Only

**결정**: 프로필은 항상 단 1건 존재 → `upsert` 패턴으로 Create/Update 통합

**이유**:
- `prisma.profile.upsert({ where: { id: 1 }, ... })` 단일 호출로 처리
- 목록 관리가 아닌 단일 레코드 편집이므로 List 컴포넌트 불필요

---

## 완료 기준 (Sprint DoD)

| # | 기준 |
|---|------|
| 1 | `app/admin/login/page.tsx`에 하드코딩 문자열 없음 — DB `profile.name` 표시 |
| 2 | `/admin/profile` 페이지 접근 시 현재 프로필 값이 폼에 자동 로드됨 |
| 3 | 폼 수정 후 저장 시 DB 업데이트 및 즉시 화면 반영 |
| 4 | PC Sidebar / 모바일 TabBar에 "프로필" 항목 정상 표시 및 이동 |
| 5 | `PUT /api/admin/profile` 인증 토큰 없으면 401 반환 |
| 6 | `revalidateTag('profile')` 호출로 공개 About 섹션 캐시 갱신 |
| 7 | `npx tsc --noEmit` 0건 + `npm run build` 성공 |
| 8 | git commit 완료 |

---

## 리스크

| # | 리스크 | 영향 | 해결 |
|---|--------|------|------|
| 1 | DB에 Profile 레코드 없을 경우 로그인 페이지 이름 표시 실패 | UI 빈 화면 | `fetch` 실패/빈 응답 시 폴백 문자열("Admin") 처리 |
| 2 | 모바일 TabBar 5개 탭 초과 시 레이아웃 깨짐 | 모바일 UX | 탭 아이콘 크기 조정 또는 대시보드 탭 제거 후 로고로 대체 검토 |
| 3 | `avatarUrl` 입력 후 공개 페이지 Avatar 미구현 | 기능 불일치 | Sprint 6 범위는 저장만 구현, 공개 페이지 Avatar 표시는 별도 백로그 등록 |

---

## 다음 스프린트 후보 (백로그)

| 항목 | 우선순위 |
|------|----------|
| 공개 페이지 About 섹션 Avatar 이미지 표시 | Medium |
| 이미지 파일 업로드 (iconUrl/avatarUrl → 파일 업로드) | Low |
| Contact 폼 이메일 전송 (Resend/SendGrid) | Medium |
| 커스텀 도메인 연결 | Low |
