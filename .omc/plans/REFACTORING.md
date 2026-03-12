# Feature-Based Refactoring Guide

`company` 리팩토링을 기준으로 작성된 가이드입니다.
나머지 도메인(`education`, `project`, `skill`, `profile`)에 동일하게 적용합니다.

---

## 1. 변경 원칙

| 항목 | 변경 전 | 변경 후 |
|------|--------|--------|
| API 라우트 폴더명 | 복수형 (`projects`, `skills`) | 단수형 (`project`, `skill`) |
| Admin 페이지 폴더명 | 복수형 (`app/admin/projects`) | 단수형 (`app/admin/project`) |
| Feature 폴더 | 없음 | `feature/{domain}/` |
| 타입 정의 위치 | `types/index.ts` (전역) | `feature/{domain}/type.ts` (도메인 로컬) |
| API 호출 위치 | 컴포넌트 내 raw fetch | `feature/{domain}/api.ts` |
| React Query 위치 | 페이지 컴포넌트 인라인 | `feature/{domain}/query.ts` |
| 캐시 무효화 위치 | 페이지 컴포넌트 `handleFormSuccess` | mutation `onSuccess` 내부 |

---

## 2. 디렉토리 구조

```
feature/
  {domain}/
    type.ts        ← 도메인 타입 (Dto, FormData, Input)
    query-key.ts   ← React Query 키 팩토리
    api.ts         ← fetch 함수 모음
    query.ts       ← useQuery / useMutation 훅

app/
  api/
    {domain}/
      route.ts         ← GET(목록), POST
      [id]/
        route.ts       ← GET(단건), PUT, DELETE
  admin/
    {domain}/
      page.tsx         ← Admin 관리 페이지 (단수형)
```

---

## 3. 각 파일 역할 및 템플릿

### `feature/{domain}/type.ts`

```ts
// 1. API 응답 타입 (DB → JSON 직렬화 결과)
export type {Domain}Dto = {
  id: number
  // ...필드
  createdAt: string
  updatedAt: string
}

// 2. 폼 상태 타입 (문자열 기반, 입력값 그대로)
export type {Domain}FormData = {
  // ...모든 필드를 string | boolean로
}

// 3. API 요청 바디 타입 (null 허용, 변환 완료 후)
export type {Domain}Input = {
  // ...필드 (null 허용)
}
```

### `feature/{domain}/query-key.ts`

```ts
export const {domain}Keys = {
  all: ['{domain}s'] as const,         // revalidateTag와 일치시킬 것
  list: () => [...{domain}Keys.all] as const,
  detail: (id: number) => [...{domain}Keys.all, id] as const,
}
```

### `feature/{domain}/api.ts`

```ts
import type { {Domain}Dto, {Domain}Input } from './type'
import type { ApiResponse } from '@/types'

export const {domain}Api = {
  getAll: async (): Promise<{Domain}Dto[]> => { ... },
  getById: async (id: number): Promise<{Domain}Dto> => { ... },
  create: async (body: {Domain}Input): Promise<{Domain}Dto> => { ... },
  update: async ({ id, ...body }: { id: number } & {Domain}Input): Promise<{Domain}Dto> => { ... },
  delete: async (id: number): Promise<void> => { ... },
}
```

### `feature/{domain}/query.ts`

```ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { {domain}Keys } from './query-key'
import { {domain}Api } from './api'

// 단건 조회 (폼 편집용, id가 null이면 비활성화)
export function use{Domain}Query(id: number | null) {
  return useQuery({
    queryKey: {domain}Keys.detail(id!),
    queryFn: () => {domain}Api.getById(id!),
    enabled: id !== null,
  })
}

// 목록 조회
export function use{Domain}sQuery() {
  return useQuery({
    queryKey: {domain}Keys.list(),
    queryFn: () => {domain}Api.getAll(),
    placeholderData: (prev) => prev,
  })
}

// 생성 mutation: onSuccess에서 목록 캐시 무효화
export function useCreate{Domain}Mutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: {domain}Api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: {domain}Keys.list() })
      options?.onSuccess?.()
    },
  })
}

// 수정 mutation: onSuccess에서 단건 캐시 갱신 + 목록 캐시 무효화
export function useUpdate{Domain}Mutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: {domain}Api.update,
    onSuccess: (updated, variables) => {
      queryClient.setQueryData({domain}Keys.detail(variables.id), updated)
      queryClient.invalidateQueries({ queryKey: {domain}Keys.list() })
      options?.onSuccess?.()
    },
  })
}

// 삭제 mutation: onSuccess에서 목록 캐시 무효화
export function useDelete{Domain}Mutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: {domain}Api.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: {domain}Keys.all }),
  })
}
```

---

## 4. 페이지 컴포넌트 패턴

### `app/admin/{domain}/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { use{Domain}sQuery, useDelete{Domain}Mutation } from '@/feature/{domain}/query'

export default function Admin{Domain}Page() {
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data = [], isPending } = use{Domain}sQuery()
  const deleteMutation = useDelete{Domain}Mutation()

  const handleDelete = (id: number) => {
    if (!window.confirm('삭제하시겠습니까?')) return
    deleteMutation.mutate(id)
  }

  return (
    // ...
    <{Domain}Form
      {domain}Id={editingId === 0 ? null : editingId}
      onSuccess={() => setEditingId(null)}   // ← 캐시 처리는 mutation이 담당
      onCancel={() => setEditingId(null)}
    />
  )
}
```

### `components/admin/{Domain}Form.tsx`

```tsx
// mutation을 컴포넌트 내부에서 선언
const { data: {domain} } = use{Domain}Query({domain}Id)
const createMutation = useCreate{Domain}Mutation({ onSuccess })
const updateMutation = useUpdate{Domain}Mutation({ onSuccess })

// useEffect로 쿼리 데이터 → 폼 상태 동기화
useEffect(() => {
  if ({domain}) {
    setFormData({ ...{domain}에서 추출 })
  } else {
    setFormData(defaultForm)
  }
}, [{domain}])

// handleSubmit은 동기 함수 (async 불필요)
const handleSubmit = (e: FormEvent) => {
  e.preventDefault()
  // validate...
  if ({domain}Id) {
    updateMutation.mutate({ id: {domain}Id, ...input })
  } else {
    createMutation.mutate(input)
  }
}
```

---

## 5. 적용 대상 도메인

| 도메인 | API 라우트 현황 | Admin 페이지 현황 | feature 폴더 현황 |
|--------|--------------|----------------|----------------|
| `company` | `app/api/company/` ✅ | `app/admin/company/` ✅ | `feature/company/` ✅ |
| `education` | `app/api/education/` ⬜ | `app/admin/education/` ⬜ | 없음 ⬜ |
| `project` | `app/api/projects/` ⬜ | `app/admin/projects/` ⬜ | 없음 ⬜ |
| `skill` | `app/api/skills/` ⬜ | `app/admin/skills/` ⬜ | 없음 ⬜ |
| `profile` | `app/api/profile/`, `app/api/admin/profile/` ⬜ | `app/admin/profile/` ⬜ | 없음 ⬜ |

---

## 6. 네이밍 규칙 요약

- **폴더명**: 항상 단수형 (`project`, `skill`, `education`)
- **queryKey 배열값**: 복수형 유지 (`['projects']`, `['skills']`) — `revalidateTag`와 일치
- **훅명**: 목록 조회는 복수형 (`useProjectsQuery`), 단건/mutation은 단수형 (`useProjectQuery`, `useDeleteProjectMutation`)
- **타입명**: `{Domain}Dto`, `{Domain}FormData`, `{Domain}Input`
- **API 객체명**: `{domain}Api` (단수형)

---

## 7. 체크리스트 (도메인별 반복)

```
[ ] feature/{domain}/type.ts 생성 (Dto, FormData, Input)
[ ] feature/{domain}/query-key.ts 생성
[ ] feature/{domain}/api.ts 생성 (getAll, getById, create, update, delete)
[ ] feature/{domain}/query.ts 생성 (5개 훅)
[ ] app/api/{domain}/ 폴더 생성 (route.ts, [id]/route.ts)
[ ] app/api/{domain복수형}/ 폴더 삭제
[ ] app/admin/{domain}/ 폴더 생성 (page.tsx)
[ ] app/admin/{domain복수형}/ 폴더 삭제
[ ] components/admin/{Domain}Form.tsx → mutation 사용, useEffect 동기화
[ ] 네비게이션 href 업데이트 (AdminSidebar, AdminTabBar, admin/page.tsx)
[ ] 기존 fetch URL 참조 전체 교체
[ ] npx tsc --noEmit 에러 0건 확인
```
