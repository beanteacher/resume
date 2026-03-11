# SPRINT5_PLAN - Resume 프로젝트

## Sprint Goal

스킬 정렬 UX 개선(sortOrder 자동 재정렬 + 드래그앤드롭), Admin CUD 후 즉시 목록 반영 버그 수정을 완료하여 관리자 경험을 완성한다.

## 기간

1일 (2026-03-11)

---

## 사전 완료 항목 (Sprint 4에서 선행 완료)

- [x] Admin CRUD (Company / Project / Skill / Education) ✅
- [x] 스크롤 진입 애니메이션 전 공개 섹션 적용 ✅
- [x] Lighthouse 최적화 (Performance/A11y/SEO/Best Practices 90+) ✅
- [x] 크로스 브라우저/디바이스 최종 QA ✅
- [x] Vercel 프로덕션 배포 (https://resume-nine-gold.vercel.app) ✅
- [x] tsc --noEmit 에러 0건, npm run build 성공 ✅

---

## 포함 범위

### 5.1 스킬 sortOrder=0 자동 배치 로직

**목표**: 정렬 순서 0 입력 시 기존 스킬 전체를 +1 이동하고 신규 스킬을 1번에 배치

**작업 내역** (완료 ✅):
- `app/api/skills/route.ts` POST 핸들러 수정
  - `sortOrder === 0` 조건: `prisma.$transaction` 내 `updateMany({ data: { sortOrder: { increment: 1 } } })` 후 신규 스킬 `sortOrder: 1` 생성
  - `sortOrder !== 0` 조건: 동일 값 중복 여부 검사 → 중복 시 409 에러 반환
  - 에러 메시지: `정렬 순서 ${sortOrder}는 이미 사용 중입니다.`

**DoD**: sortOrder=0 입력 시 신규 스킬이 목록 맨 앞(1번)에 위치, 기존 항목 순서 유지

---

### 5.2 중복 sortOrder 입력 시 에러 메시지

**목표**: 동일 sortOrder 값 입력 시 명확한 에러 메시지를 폼에 표시

**작업 내역** (완료 ✅):
- `app/api/skills/route.ts`: 409 응답 + `{ error: '정렬 순서 N는 이미 사용 중입니다.' }` 반환
- `components/admin/SkillForm.tsx`: `res.ok` 실패 시 응답 body `json.error` 파싱 → `errors.submit`에 표시
- Admin 전 폼 동일 패턴 적용: `CompanyForm`, `EducationForm`, `ProjectForm`
  - `if (!res.ok) { const json = await res.json(); throw new Error(json.error ?? '저장에 실패했습니다.') }`

**DoD**: 중복 sortOrder 입력 시 폼 하단에 서버 에러 메시지 노출

---

### 5.3 Admin CUD 후 즉시 목록 반영 버그 수정

**목표**: 생성/수정/삭제 후 페이지 새로고침 없이 목록 즉시 갱신

**근본 원인 분석**:
- API Route Handler GET 엔드포인트에 `unstable_cache`가 적용되어 있어 응답이 5분간 캐시됨
- `revalidateTag`는 서버 컴포넌트(SSR) 캐시를 무효화하지만, Route Handler `unstable_cache`는 별도 캐시 키로 관리되어 신뢰할 수 없음
- React Query `invalidateQueries` 호출은 정상이었으나, API가 캐시된 구 데이터를 반환해 목록이 갱신되지 않음

**작업 내역** (완료 ✅):
- `app/api/skills/route.ts` GET: `unstable_cache` 제거 → Prisma 직접 쿼리
- `app/api/companies/route.ts` GET: `unstable_cache` 제거
- `app/api/education/route.ts` GET: `unstable_cache` 제거
- `app/api/projects/route.ts` GET: `unstable_cache` 제거
- `revalidateTag` 호출은 SSR 공개 페이지 캐시 무효화용으로 유지 (POST/PUT/DELETE 핸들러에만 존재)

**Playwright 검증 (완료)**:
- 스킬 추가 → 목록 즉시 반영 확인
- 스킬 삭제 → 목록에서 즉시 제거 확인
- sortOrder 재정렬 DB 직접 확인 (연속 순서 1~N 유지)

**DoD**: CUD 작업 후 새로고침 없이 React Query 목록 즉시 반영

---

### 5.4 DELETE 후 카테고리 내 sortOrder 1부터 연속 재정렬

**목표**: 스킬 삭제 후 동일 카테고리의 나머지 스킬 sortOrder를 1부터 연속 재배치

**작업 내역** (완료 ✅):
- `app/api/skills/[id]/route.ts` DELETE 핸들러: `prisma.$transaction` 추가
  ```ts
  await prisma.$transaction(async (tx) => {
    const skill = await tx.skill.findUnique({ where: { id } })
    if (!skill) throw new Error('NOT_FOUND')
    await tx.skill.delete({ where: { id } })
    const remaining = await tx.skill.findMany({
      where: { category: skill.category },
      orderBy: { sortOrder: 'asc' },
    })
    await Promise.all(
      remaining.map((s, i) => tx.skill.update({ where: { id: s.id }, data: { sortOrder: i + 1 } }))
    )
  })
  ```

**DoD**: 스킬 삭제 후 동일 카테고리의 sortOrder가 1~N 연속값으로 재정렬됨

---

### 5.5 드래그앤드롭 스킬 순서 변경 UI

**목표**: Admin 스킬 목록에서 카테고리 내 드래그앤드롭으로 순서 변경

**신규 패키지** (완료 ✅):
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` 설치

**PATCH /api/skills/reorder 엔드포인트 신규 추가** (완료 ✅):
- `app/api/skills/reorder/route.ts`
  ```ts
  export async function PATCH(request: NextRequest) {
    const body = await request.json() as { updates: Array<{ id: number; sortOrder: number }> }
    await prisma.$transaction(
      body.updates.map(({ id, sortOrder }) =>
        prisma.skill.update({ where: { id }, data: { sortOrder } })
      )
    )
    try { revalidateTag('skills') } catch {}
    return NextResponse.json({ data: { success: true } })
  }
  ```

**SkillList.tsx 전면 재작성** (완료 ✅):
- `SortableRow` 컴포넌트: `useSortable` 훅, 드래그 핸들 버튼(⠿ 아이콘 SVG)
  - `attributes`, `listeners`, `setNodeRef`, `transform`, `transition`, `isDragging` 활용
  - 드래그 중 `opacity: 0.5` 시각 피드백
- `CategoryTable` 컴포넌트: 카테고리별 `DndContext` + `SortableContext`
  - `PointerSensor` + `KeyboardSensor` 멀티 입력 지원
  - `handleDragEnd`: `arrayMove` → 로컬 상태 업데이트 → `onReorder` 콜백
  - 외부 데이터 변경(invalidateQueries) 시 로컬 상태 동기화 (`syncKey` 패턴)
- `SkillList` 컴포넌트: props에 `onReorder` 추가

**app/admin/skills/page.tsx 수정** (완료 ✅):
- `reorderMutation`: `PATCH /api/skills/reorder` 호출, 성공 시 `invalidateQueries(['skills'])`
- `handleReorder` 핸들러 추가
- `<SkillList onReorder={handleReorder} />` 연결

**SkillForm.tsx 수정** (완료 ✅):
- 수정 모드(`skillId !== null`)에서 sortOrder 입력 숨김 (드래그로 대체)
- PUT 요청 body에서 sortOrder 제외: `...(skillId ? {} : { sortOrder: ... })`

**DoD**: 카테고리 내 드래그앤드롭으로 순서 변경, DB에 즉시 반영, 목록 리프레시 시 순서 유지

---

## 파일 변경 목록

| 파일 | 변경 유형 | 내용 |
|------|-----------|------|
| `app/api/skills/route.ts` | 수정 | unstable_cache 제거, sortOrder=0 로직, 중복 검사 409 |
| `app/api/skills/[id]/route.ts` | 수정 | DELETE 트랜잭션 + 재정렬, PUT에서 sortOrder 제거 |
| `app/api/skills/reorder/route.ts` | 신규 | PATCH 배치 정렬 업데이트 엔드포인트 |
| `app/api/companies/route.ts` | 수정 | GET에서 unstable_cache 제거 |
| `app/api/education/route.ts` | 수정 | GET에서 unstable_cache 제거 |
| `app/api/projects/route.ts` | 수정 | GET에서 unstable_cache 제거 |
| `components/admin/SkillList.tsx` | 전면 재작성 | @dnd-kit 드래그앤드롭, SortableRow, CategoryTable |
| `components/admin/SkillForm.tsx` | 수정 | 수정 모드 sortOrder 숨김, 에러 메시지 파싱 |
| `components/admin/CompanyForm.tsx` | 수정 | API 에러 메시지 파싱 통일 |
| `components/admin/EducationForm.tsx` | 수정 | API 에러 메시지 파싱 통일 |
| `components/admin/ProjectForm.tsx` | 수정 | API 에러 메시지 파싱 통일 |
| `app/admin/skills/page.tsx` | 수정 | reorderMutation, handleReorder 추가 |
| `package.json` | 수정 | @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities 추가 |
| `package-lock.json` | 수정 | 패키지 의존성 업데이트 |

---

## 기술 의사결정 (ADR)

### ADR-1: Route Handler unstable_cache 제거

**결정**: Admin API Route Handler GET에서 `unstable_cache` 완전 제거

**드라이버**:
- Admin 페이지는 항상 최신 데이터가 필요한 관리자 도구
- `unstable_cache`와 `revalidateTag`의 상호작용이 불안정하여 CUD 후 캐시 무효화 신뢰 불가
- Route Handler 응답 캐시는 CDN/브라우저 캐시와 별개로 동작

**검토된 대안**:
1. `revalidateTag` 호출 방식 개선 → 근본 원인 해결 불가 (동일 불안정성)
2. `no-store` 헤더 추가 → `unstable_cache` 내부에서는 효과 없음
3. `unstable_cache` 완전 제거 → 선택 ✅

**결과**: SSR 공개 페이지용 `revalidateTag`는 유지, Admin API는 직접 Prisma 쿼리

---

### ADR-2: 드래그앤드롭 라이브러리 선택

**결정**: `@dnd-kit` (core + sortable + utilities) 사용

**드라이버**:
- React 18+ 및 Next.js App Router와의 호환성
- 가볍고 접근성(a11y) 지원 (키보드 정렬 가능)
- 이미 프로젝트에서 고려된 옵션

**검토된 대안**:
1. `react-beautiful-dnd` → React 18 StrictMode 비호환, 유지보수 종료
2. `react-dnd` → 설정 복잡도 높음
3. `@dnd-kit` → 선택 ✅

---

### ADR-3: 수정 시 sortOrder 입력 제거

**결정**: 스킬 수정 폼에서 sortOrder 입력 필드 숨김, 드래그앤드롭으로 대체

**드라이버**:
- UX 일관성: 순서 변경은 드래그앤드롭 단일 인터페이스
- 혼용 시 사용자 혼란 발생 가능

---

## 완료 기준 (Sprint DoD)

| # | 기준 | 결과 |
|---|------|------|
| 1 | sortOrder=0 입력 시 신규 스킬이 1번으로 배치 | ✅ |
| 2 | 중복 sortOrder 입력 시 폼에 에러 메시지 표시 | ✅ |
| 3 | 스킬 삭제 후 동일 카테고리 sortOrder 1~N 재정렬 | ✅ |
| 4 | Admin CUD 후 새로고침 없이 목록 즉시 반영 | ✅ |
| 5 | 카테고리 내 드래그앤드롭 순서 변경 동작 | ✅ |
| 6 | 드래그 후 DB sortOrder 즉시 반영 | ✅ |
| 7 | 수정 폼에서 sortOrder 입력 숨김 | ✅ |
| 8 | Admin 전 폼 API 에러 메시지 파싱 통일 | ✅ |
| 9 | git commit & push 완료 | ✅ |

---

## 리스크 및 해결

| # | 리스크 | 영향 | 해결 |
|---|--------|------|------|
| 1 | Playwright drag 이벤트와 @dnd-kit PointerEvent 비호환 | 자동화 테스트 불가 | `browser_evaluate`로 PATCH API 직접 호출하여 검증 |
| 2 | unstable_cache 제거 시 SSR 성능 영향 | 공개 페이지 응답 속도 | SSR은 `unstable_cache` + `revalidateTag` 유지, Admin API만 제거 |
| 3 | 카테고리 간 드래그 방지 필요 | 데이터 무결성 | `SortableContext`를 카테고리별로 분리하여 크로스-카테고리 드래그 물리적 차단 |

---

## 커밋 이력

| 커밋 | 메시지 | 날짜 |
|------|--------|------|
| 6127e8c | feat(sprint5): 스킬 정렬 개선 + 드래그앤드롭 + CUD 새로고침 수정 | 2026-03-11 |

---

## 다음 스프린트 후보 (백로그)

| 항목 | 우선순위 | 비고 |
|------|----------|------|
| Contact 폼 이메일 전송 (Resend/SendGrid) | Medium | MVP 범위 외, 사용자 요청 시 |
| 커스텀 도메인 연결 | Low | 도메인 결정 후 진행 |
| 공개 페이지 스킬 순서 표시 (sortOrder 반영) | Medium | 현재는 category 내 정렬만 Admin에서 관리 |
| Admin 이미지 업로드 (iconUrl → 파일 업로드) | Low | 현재 URL 직접 입력 |
