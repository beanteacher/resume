# Resume 프로젝트 — Admin 페이지 FE 핸드오프

> **문서**: Admin 페이지 프론트엔드 구현 가이드
> **작성일**: 2026-03-09
> **대상**: FE 개발자 (Next.js 구현)
> **스택**: Next.js 16.1.6, React 19, TypeScript, Tailwind v4 (globals.css @theme)
> **테마**: 다크 모드 기본 (next-themes 적용)
> **언어**: 한국어

---

## 0. 개요

Admin 섹션은 이력서 포트폴리오의 콘텐츠를 관리하는 비공개 페이지입니다. 회사, 프로젝트, 스킬 정보를 CRUD할 수 있으며, 로그인 기반 인증으로 보호됩니다.

**핵심 특징:**
- 비밀번호 기반 로그인 (쿠키 저장)
- 반응형 레이아웃 (PC: 사이드바 240px, 모바일: 하단 탭바)
- 테이블 기반 CRUD (목록/추가/수정/삭제)
- 다크 모드 기본, 라이트 모드 지원

---

## 1. 파일 구조

### 페이지 계층
```
app/
├── admin/
│   ├── layout.tsx              ← 사이드바 + 콘텐츠 레이아웃
│   ├── login/
│   │   └── page.tsx            ← 로그인 페이지
│   ├── page.tsx                ← 대시보드
│   ├── companies/
│   │   └── page.tsx            ← Company CRUD
│   ├── projects/
│   │   └── page.tsx            ← Project CRUD
│   └── skills/
│       └── page.tsx            ← Skill CRUD
```

### 컴포넌트 계층
```
components/
├── admin/
│   ├── AdminLayout.tsx         ← 사이드바 + 메뉴 (재사용)
│   ├── AdminSidebar.tsx        ← PC 사이드바
│   ├── AdminTabBar.tsx         ← 모바일 하단 탭바
│   ├── CompanyList.tsx         ← Company 목록 + 폼 섹션
│   ├── ProjectList.tsx         ← Project 목록 + 폼 섹션
│   └── SkillList.tsx           ← Skill 목록 + 폼 섹션
├── ui/
│   ├── Button.tsx              ← 기존
│   ├── Card.tsx                ← 기존
│   ├── Input.tsx               ← 신규 (추가해야 함)
│   ├── Badge.tsx               ← 신규 (추가해야 함)
│   ├── Select.tsx              ← 신규 (추가해야 함)
│   └── Modal.tsx               ← 신규 (추가해야 함, 선택사항)
```

---

## 2. 인증 및 레이아웃

### 인증 흐름 (`middleware.ts`)

**현재 상태**: 기존 `middleware.ts`가 `/admin/*` 경로를 보호함

```typescript
// 동작 원리
1. /admin/* 요청 → middleware.ts 실행
2. /admin/login인 경우 → 쿠키 검증 없이 통과
3. 다른 경로 → admin_token 쿠키 검증
   - 쿠키 없거나 유효하지 않음 → /admin/login 리다이렉트
   - 유효함 → 페이지 표시
```

**쿠키 정보:**
```typescript
name: 'admin_token'
value: process.env.ADMIN_SECRET (로그인 시 설정)
httpOnly: true (자바스크립트 접근 불가)
secure: true (HTTPS만)
maxAge: 86400 (24시간)
sameSite: 'lax'
```

### Admin Layout 구조 (`app/admin/layout.tsx`)

```typescript
'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTabBar } from '@/components/admin/AdminTabBar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return children  // 로그인 페이지는 사이드바 없음
  }

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* PC: 왼쪽 사이드바 240px */}
      <div className="hidden lg:flex w-60 flex-col bg-[var(--surface)] border-r border-[var(--border-color)]">
        <AdminSidebar />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* 모바일: 하단 탭바 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--surface)] border-t border-[var(--border-color)]">
        <AdminTabBar />
      </div>
    </div>
  )
}
```

---

## 3. 로그인 페이지 (`app/admin/login/page.tsx`)

```typescript
'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json() as { error: string }
        setError(data.error || '로그인 실패')
        return
      }

      router.push('/admin')
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
            오민성
          </h1>
          <h2 className="text-[var(--font-size-h2)] font-bold text-[var(--text)]">
            Admin
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text)] mb-2">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="관리자 비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
```

---

## 4. 대시보드 (`app/admin/page.tsx`)

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    companies: 0,
    projects: 0,
    skills: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [companiesRes, projectsRes, skillsRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/projects'),
          fetch('/api/skills'),
        ])

        const companies = await companiesRes.json() as { data: unknown[] }
        const projects = await projectsRes.json() as { data: { items: unknown[] } }
        const skills = await skillsRes.json() as { data: Record<string, unknown[]> }

        setStats({
          companies: companies.data.length,
          projects: projects.data.items.length,
          skills: Object.values(skills.data).flat().length,
        })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    { label: '회사', count: stats.companies, href: '/admin/companies' },
    { label: '프로젝트', count: stats.projects, href: '/admin/projects' },
    { label: '스킬', count: stats.skills, href: '/admin/skills' },
  ]

  return (
    <div>
      <h1 className="text-[var(--font-size-h1)] font-bold text-[var(--text)] mb-8">
        대시보드
      </h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statItems.map((item) => (
          <Card key={item.label} hover className="flex flex-col justify-between">
            <div>
              <p className="text-[var(--text-secondary)] text-sm font-medium mb-2">
                {item.label}
              </p>
              <p className="text-4xl font-bold text-[var(--color-brand-purple)]">
                {loading ? '—' : item.count}
              </p>
            </div>
            <Link href={item.href}>
              <Button variant="ghost" size="sm" className="mt-4 w-full">
                관리 →
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      {/* 빠른 링크 */}
      <Card>
        <h3 className="text-[var(--font-size-h3)] font-semibold text-[var(--text)] mb-4">
          빠른 접근
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/companies">
            <Button variant="secondary" className="w-full justify-start">
              회사 관리
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="secondary" className="w-full justify-start">
              프로젝트 관리
            </Button>
          </Link>
          <Link href="/admin/skills">
            <Button variant="secondary" className="w-full justify-start">
              스킬 관리
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
```

---

## 5. Company 페이지 (`app/admin/companies/page.tsx`)

### 데이터 모델
```typescript
interface Company {
  id: number
  name: string           // 회사명 (예: "당근마켓")
  role: string           // 직책 (예: "Senior FE Engineer")
  startDate: string      // ISO 날짜 (예: "2023-01-15T00:00:00.000Z")
  endDate: string | null // ISO 날짜 또는 null
  isCurrent: boolean     // 현재 근무 여부
  description: string    // 설명 (예: "...3줄 정도")
  logoUrl: string | null // 회사 로고 URL
  createdAt: string
  updatedAt: string
}
```

### API 엔드포인트
```typescript
GET    /api/companies           → { data: Company[] }
POST   /api/companies           → body: CompanyInput → Company
GET    /api/companies/:id       → { data: Company }
PUT    /api/companies/:id       → body: CompanyInput → Company
DELETE /api/companies/:id       → { data: { success: true } }
```

### 폼 인풋 (CompanyInput)
```typescript
{
  name: string           // 필수, 1~100자
  role: string           // 필수, 1~100자
  startDate: string      // 필수, ISO 날짜 (YYYY-MM-DD)
  endDate?: string       // 선택, ISO 날짜 (isCurrent=false일 때 필수)
  isCurrent: boolean     // 필수, true면 endDate 비활성화
  description: string    // 필수, 1~500자
  logoUrl?: string       // 선택, URL
}
```

### 페이지 구현
```typescript
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CompanyList } from '@/components/admin/CompanyList'

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies')
      const data = await res.json() as { data: Company[] }
      setCompanies(data.data)
    } catch (err) {
      console.error('Failed to fetch companies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 회사를 삭제하시겠습니까?')) return

    try {
      await fetch(`/api/companies/${id}`, { method: 'DELETE' })
      setCompanies(companies.filter(c => c.id !== id))
    } catch (err) {
      console.error('Failed to delete company:', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[var(--font-size-h1)] font-bold text-[var(--text)]">
          회사 관리
        </h1>
        <Button
          variant="primary"
          onClick={() => setEditingId(0)} // 0 = 신규
        >
          + 회사 추가
        </Button>
      </div>

      {/* 폼 섹션 */}
      {editingId !== null && (
        <Card className="mb-8 p-6">
          <CompanyForm
            companyId={editingId === 0 ? null : editingId}
            onSuccess={() => {
              setEditingId(null)
              fetchCompanies()
            }}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      {/* 목록 */}
      <CompanyList
        companies={companies}
        loading={loading}
        onEdit={setEditingId}
        onDelete={handleDelete}
      />
    </div>
  )
}
```

### 목록 테이블 구조 (`components/admin/CompanyList.tsx`)
```
| 회사명     | 직책               | 기간           | 상태   | 액션     |
|-----------|-------------------|----------------|--------|----------|
| 당근마켓  | Senior FE Eng.    | 2023.01~현재   | 진행중 | 수정 삭제 |
| 라인플러스| FE Engineer       | 2020.06~2022.12| 완료   | 수정 삭제 |
```

---

## 6. Project 페이지 (`app/admin/projects/page.tsx`)

### 데이터 모델
```typescript
interface Project {
  id: number
  title: string                 // 프로젝트 이름
  description: string           // 설명 (마크다운 가능)
  techStack: string            // JSON.stringify(string[]) (예: '["React","Next.js"]')
  achievements: string         // JSON.stringify(string[]) (예: '["성과1","성과2"]')
  thumbnailUrl: string | null  // 대표 이미지 URL
  githubUrl: string | null     // GitHub 저장소 URL
  demoUrl: string | null       // 라이브 데모 URL
  companyId: number | null     // Company 외래키 (선택)
  createdAt: string
  updatedAt: string
  company?: Company
}
```

### API 엔드포인트
```typescript
GET    /api/projects              → { data: { items: Project[], nextCursor: number|null } }
POST   /api/projects              → body: ProjectInput → Project
GET    /api/projects/:id          → { data: Project }
PUT    /api/projects/:id          → body: ProjectInput → Project
DELETE /api/projects/:id          → { data: { success: true } }
```

### 폼 인풋 (ProjectInput)
```typescript
{
  title: string          // 필수, 1~200자
  description: string    // 필수, 마크다운, 1~2000자
  techStack: string[]    // 필수, 배열 → JSON.stringify로 저장
  achievements: string[] // 필수, 배열 → JSON.stringify로 저장
  companyId?: number     // 선택, Company 선택
  githubUrl?: string     // 선택, URL
  demoUrl?: string       // 선택, URL
  thumbnailUrl?: string  // 선택, URL
}
```

### 페이지 구현
```typescript
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProjectList } from '@/components/admin/ProjectList'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json() as { data: { items: Project[] } }
      setProjects(data.data.items)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 프로젝트를 삭제하시겠습니까?')) return

    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      setProjects(projects.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[var(--font-size-h1)] font-bold text-[var(--text)]">
          프로젝트 관리
        </h1>
        <Button
          variant="primary"
          onClick={() => setEditingId(0)}
        >
          + 프로젝트 추가
        </Button>
      </div>

      {editingId !== null && (
        <Card className="mb-8">
          <ProjectForm
            projectId={editingId === 0 ? null : editingId}
            onSuccess={() => {
              setEditingId(null)
              fetchProjects()
            }}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <ProjectList
        projects={projects}
        loading={loading}
        onEdit={setEditingId}
        onDelete={handleDelete}
      />
    </div>
  )
}
```

### 목록 테이블 구조 (`components/admin/ProjectList.tsx`)
```
| 프로젝트명        | 회사         | 기술스택     | 액션     |
|------------------|-------------|-------------|----------|
| 당근마켓 앱 V2   | 당근마켓    | 5개 스택    | 수정 삭제 |
| 개인 포트폴리오  | (없음)      | 3개 스택    | 수정 삭제 |
```

---

## 7. Skill 페이지 (`app/admin/skills/page.tsx`)

### 데이터 모델
```typescript
interface Skill {
  id: number
  name: string          // 스킬명 (예: "React", "TypeScript")
  category: string      // 카테고리: Frontend|Backend|Database|DevOps|Tool
  proficiency: number   // 숙련도: 1~5
  iconUrl: string | null // 아이콘 URL
  sortOrder: number     // 정렬 순서
  createdAt: string
  updatedAt: string
}
```

### API 엔드포인트
```typescript
GET    /api/skills           → { data: { [category]: Skill[] } }  // 카테고리별 그룹화
POST   /api/skills           → body: SkillInput → Skill
GET    /api/skills/:id       → { data: Skill }
PUT    /api/skills/:id       → body: SkillInput → Skill
DELETE /api/skills/:id       → { data: { success: true } }
```

### 폼 인풋 (SkillInput)
```typescript
{
  name: string          // 필수, 1~50자
  category: string      // 필수, Frontend|Backend|Database|DevOps|Tool
  proficiency: 1|2|3|4|5 // 필수, 슬라이더 (1~5)
  iconUrl?: string      // 선택, URL
  sortOrder: number     // 필수, 정렬 순서 (정수)
}
```

### 페이지 구현
```typescript
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SkillList } from '@/components/admin/SkillList'

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Record<string, Skill[]>>({})
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      const data = await res.json() as { data: Record<string, Skill[]> }
      setSkills(data.data)
    } catch (err) {
      console.error('Failed to fetch skills:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 스킬을 삭제하시겠습니까?')) return

    try {
      await fetch(`/api/skills/${id}`, { method: 'DELETE' })
      fetchSkills()
    } catch (err) {
      console.error('Failed to delete skill:', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[var(--font-size-h1)] font-bold text-[var(--text)]">
          스킬 관리
        </h1>
        <Button
          variant="primary"
          onClick={() => setEditingId(0)}
        >
          + 스킬 추가
        </Button>
      </div>

      {editingId !== null && (
        <Card className="mb-8">
          <SkillForm
            skillId={editingId === 0 ? null : editingId}
            onSuccess={() => {
              setEditingId(null)
              fetchSkills()
            }}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      )}

      <SkillList
        skills={skills}
        loading={loading}
        onEdit={setEditingId}
        onDelete={handleDelete}
      />
    </div>
  )
}
```

### 목록 테이블 구조 (`components/admin/SkillList.tsx`)
```
카테고리별 섹션:

| Frontend          | 카테고리   | 숙련도 | 액션     |
|------------------|-----------|--------|----------|
| React            | Frontend  | ★★★★★ | 수정 삭제 |
| TypeScript       | Frontend  | ★★★★☆ | 수정 삭제 |
| Next.js          | Frontend  | ★★★★★ | 수정 삭제 |

(Backend, Database, DevOps, Tool도 동일)
```

---

## 8. 필수 UI 컴포넌트

### 8-1. Input 컴포넌트 (`components/ui/Input.tsx`)

```typescript
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}
      <input
        className={`
          px-4 py-2 rounded-[var(--radius-sm)]
          bg-[var(--elevated)] text-[var(--text)]
          border border-[var(--border-color)]
          placeholder:text-[var(--text-secondary)]
          transition-colors duration-[var(--transition-fast)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-purple)]
          focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-[var(--text-secondary)]">{helperText}</p>
      )}
    </div>
  )
}
```

### 8-2. Badge 컴포넌트 (`components/ui/Badge.tsx`)

```typescript
interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

export function Badge({
  children,
  variant = 'secondary',
  size = 'sm',
}: BadgeProps) {
  const variants = {
    primary: 'bg-[var(--color-brand-purple)]/20 text-[var(--color-brand-purple)]',
    secondary: 'bg-[var(--elevated)] text-[var(--text)]',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
  }

  const sizes = {
    sm: 'px-2.5 py-1 text-xs font-medium rounded-full',
    md: 'px-3 py-1.5 text-sm font-medium rounded-full',
  }

  return (
    <span className={`inline-block ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}
```

### 8-3. Select 컴포넌트 (`components/ui/Select.tsx`)

```typescript
import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string | number; label: string }>
}

export function Select({
  label,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}
      <select
        className={`
          px-4 py-2 rounded-[var(--radius-sm)]
          bg-[var(--elevated)] text-[var(--text)]
          border border-[var(--border-color)]
          cursor-pointer
          transition-colors duration-[var(--transition-fast)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-purple)]
          focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">선택하세요</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}
```

### 8-4. AdminSidebar 컴포넌트 (`components/admin/AdminSidebar.tsx`)

```typescript
'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin', label: '대시보드', icon: '📊' },
    { href: '/admin/companies', label: '회사', icon: '🏢' },
    { href: '/admin/projects', label: '프로젝트', icon: '🛠️' },
    { href: '/admin/skills', label: '스킬', icon: '⚙️' },
  ]

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="flex flex-col h-full p-6">
      {/* 로고 */}
      <Link href="/admin" className="mb-12">
        <h3 className="text-xl font-bold text-[var(--color-brand-purple)]">
          Admin
        </h3>
      </Link>

      {/* 메뉴 */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`
                  w-full text-left px-4 py-2 rounded-[var(--radius-md)]
                  transition-colors duration-[var(--transition-fast)]
                  ${
                    isActive
                      ? 'bg-[var(--color-brand-purple)]/20 text-[var(--color-brand-purple)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)]'
                  }
                `}
              >
                {item.icon} {item.label}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* 로그아웃 */}
      <Button
        variant="ghost"
        size="md"
        onClick={handleLogout}
        className="w-full justify-start text-red-500 hover:bg-red-500/10"
      >
        🚪 로그아웃
      </Button>
    </div>
  )
}
```

### 8-5. AdminTabBar 컴포넌트 (`components/admin/AdminTabBar.tsx`, 모바일용)

```typescript
'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function AdminTabBar() {
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    { href: '/admin', label: '대시보드', icon: '📊' },
    { href: '/admin/companies', label: '회사', icon: '🏢' },
    { href: '/admin/projects', label: '프로젝트', icon: '🛠️' },
    { href: '/admin/skills', label: '스킬', icon: '⚙️' },
  ]

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="flex justify-around items-center h-full px-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href}>
            <button
              className={`
                flex flex-col items-center gap-1 px-3 py-2
                text-xs font-medium
                transition-colors duration-[var(--transition-fast)]
                ${
                  isActive
                    ? 'text-[var(--color-brand-purple)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          </Link>
        )
      })}
      <button
        onClick={handleLogout}
        className="text-red-500 hover:bg-red-500/10 px-3 py-2 rounded"
      >
        🚪
      </button>
    </div>
  )
}
```

---

## 9. 폼 컴포넌트 구현 가이드

### Company 폼 (`components/admin/CompanyForm.tsx`)

```typescript
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface CompanyFormProps {
  companyId: number | null
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  name: string
  role: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  logoUrl: string
}

export function CompanyForm({ companyId, onSuccess, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    logoUrl: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId)
    }
  }, [companyId])

  const fetchCompany = async (id: number) => {
    try {
      const res = await fetch(`/api/companies/${id}`)
      const data = await res.json() as { data: Company }
      const company = data.data
      setFormData({
        name: company.name,
        role: company.role,
        startDate: company.startDate.split('T')[0],
        endDate: company.endDate?.split('T')[0] || '',
        isCurrent: company.isCurrent,
        description: company.description,
        logoUrl: company.logoUrl || '',
      })
    } catch (err) {
      console.error('Failed to fetch company:', err)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    // 기본 검증
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = '회사명은 필수입니다.'
    if (!formData.role.trim()) newErrors.role = '직책은 필수입니다.'
    if (!formData.startDate) newErrors.startDate = '시작일은 필수입니다.'
    if (!formData.isCurrent && !formData.endDate) newErrors.endDate = '종료일은 필수입니다.'
    if (formData.description.length < 10) newErrors.description = '설명은 최소 10자 이상입니다.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const method = companyId ? 'PUT' : 'POST'
      const url = companyId ? `/api/companies/${companyId}` : '/api/companies'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          startDate: formData.startDate,
          endDate: formData.isCurrent ? null : formData.endDate,
          isCurrent: formData.isCurrent,
          description: formData.description,
          logoUrl: formData.logoUrl || undefined,
        }),
      })

      if (!res.ok) throw new Error('Failed to save company')
      onSuccess()
    } catch (err) {
      console.error('Error saving company:', err)
      setErrors({ submit: '저장에 실패했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-[var(--font-size-h3)] font-semibold text-[var(--text)]">
        {companyId ? '회사 수정' : '회사 추가'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="회사명"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          disabled={loading}
        />
        <Input
          label="직책"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          error={errors.role}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="시작일"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          error={errors.startDate}
          disabled={loading}
        />
        <Input
          type="date"
          label="종료일"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          error={errors.endDate}
          disabled={loading || formData.isCurrent}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isCurrent}
          onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
          disabled={loading}
          className="w-5 h-5 cursor-pointer"
        />
        <span className="text-sm font-medium text-[var(--text)]">현재 재직 중</span>
      </label>

      <Input
        label="설명"
        as="textarea"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        disabled={loading}
        rows={4}
      />

      <Input
        label="로고 URL (선택)"
        placeholder="https://example.com/logo.png"
        value={formData.logoUrl}
        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
        disabled={loading}
      />

      {errors.submit && (
        <p className="text-sm text-red-500 font-medium">{errors.submit}</p>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? '저장 중...' : '저장'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          취소
        </Button>
      </div>
    </form>
  )
}
```

> **참고**: Project 폼과 Skill 폼도 유사한 구조로 구현하세요. techStack과 achievements는 쉼표 구분 문자열로 입력받아 JSON.stringify로 변환합니다.

---

## 10. 목록 컴포넌트 구현 가이드

### Company 목록 (`components/admin/CompanyList.tsx`)

```typescript
'use client'

import { Company } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingState, EmptyState } from '@/components/common'

interface CompanyListProps {
  companies: Company[]
  loading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function CompanyList({
  companies,
  loading,
  onEdit,
  onDelete,
}: CompanyListProps) {
  if (loading) return <LoadingState />
  if (companies.length === 0) return <EmptyState message="회사 정보가 없습니다." />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              <th className="px-4 py-3 font-semibold text-[var(--text)] text-sm">회사명</th>
              <th className="px-4 py-3 font-semibold text-[var(--text)] text-sm">직책</th>
              <th className="px-4 py-3 font-semibold text-[var(--text)] text-sm">기간</th>
              <th className="px-4 py-3 font-semibold text-[var(--text)] text-sm">상태</th>
              <th className="px-4 py-3 font-semibold text-[var(--text)] text-sm">액션</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr
                key={company.id}
                className="border-b border-[var(--border-color)] hover:bg-[var(--elevated)] transition-colors"
              >
                <td className="px-4 py-4 text-[var(--text)]">{company.name}</td>
                <td className="px-4 py-4 text-[var(--text-secondary)] text-sm">{company.role}</td>
                <td className="px-4 py-4 text-[var(--text-secondary)] text-sm">
                  {new Date(company.startDate).toLocaleDateString('ko-KR')}
                  {company.endDate && ` ~ ${new Date(company.endDate).toLocaleDateString('ko-KR')}`}
                </td>
                <td className="px-4 py-4">
                  <Badge variant={company.isCurrent ? 'success' : 'secondary'}>
                    {company.isCurrent ? '진행중' : '완료'}
                  </Badge>
                </td>
                <td className="px-4 py-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(company.id)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(company.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
```

---

## 11. API 응답 처리

### 모든 API는 통일된 응답 형식 사용:

```typescript
// 성공 응답
{
  data: T  // 실제 데이터
}

// 에러 응답
{
  data: null,
  error: "에러 메시지"
}
```

### 타입 안전 처리:

```typescript
// API 호출
const res = await fetch('/api/companies')
const data = await res.json() as { data: Company[] }

// 타입 자동 추론
const companies: Company[] = data.data
```

---

## 12. 검증 규칙

### Company
- `name`: 1~100자 (필수)
- `role`: 1~100자 (필수)
- `startDate`: 유효한 ISO 날짜 (필수)
- `endDate`: 유효한 ISO 날짜 또는 null (isCurrent=false일 때 필수)
- `isCurrent`: boolean (필수)
- `description`: 10~500자 (필수)
- `logoUrl`: URL 형식 (선택)

### Project
- `title`: 1~200자 (필수)
- `description`: 10~2000자 (필수)
- `techStack`: string[] (필수, 최소 1개)
- `achievements`: string[] (필수, 최소 1개)
- `companyId`: 존재하는 Company ID 또는 null (선택)
- `githubUrl`: 유효한 URL 또는 null (선택)
- `demoUrl`: 유효한 URL 또는 null (선택)
- `thumbnailUrl`: 유효한 URL 또는 null (선택)

### Skill
- `name`: 1~50자 (필수)
- `category`: Frontend|Backend|Database|DevOps|Tool (필수)
- `proficiency`: 1~5 (필수)
- `iconUrl`: 유효한 URL 또는 null (선택)
- `sortOrder`: 정수 (필수)

---

## 13. 에러 처리

### 네트워크 에러
```typescript
try {
  const res = await fetch('/api/...')
  if (!res.ok) {
    const { error } = await res.json()
    setError(error || '요청 실패')
  }
} catch (err) {
  setError('네트워크 오류가 발생했습니다.')
}
```

### 폼 검증 에러
```typescript
const errors: Record<string, string> = {}
if (!name.trim()) errors.name = '이름은 필수입니다.'
if (Object.keys(errors).length > 0) {
  setErrors(errors)
  return
}
```

---

## 14. 로그아웃 구현

### API 엔드포인트
```typescript
POST /api/admin/logout → { data: { success: true } }
```

### 프론트엔드
```typescript
const handleLogout = async () => {
  await fetch('/api/admin/logout', { method: 'POST' })
  router.push('/admin/login')  // /admin/login으로 리다이렉트
}
```

---

## 15. 다크/라이트 모드 자동 지원

모든 컴포넌트는 CSS 변수(`var(--bg)`, `var(--text)` 등)를 사용하므로, `next-themes` 설정이 자동으로 다크/라이트 모드를 지원합니다. 별도 구현 필요 없음.

---

## 16. 반응형 레이아웃

### 중단점
```
모바일: < lg (1024px)    → 사이드바 숨김, 하단 탭바 표시
데스크톱: >= lg (1024px) → 사이드바 표시, 콘텐츠 왼쪽
```

### Tailwind 클래스 사용
```typescript
// 모바일 우선
<div className="hidden lg:flex">PC에만 표시</div>
<div className="lg:hidden">모바일에만 표시</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">반응형 그리드</div>
```

---

## 17. 구현 체크리스트

### Phase 1: 기본 구조 (1~2일)
- [ ] `app/admin/layout.tsx` 구현
- [ ] `app/admin/login/page.tsx` 구현
- [ ] AdminSidebar, AdminTabBar 컴포넌트 구현
- [ ] Input, Badge, Select 컴포넌트 구현

### Phase 2: 대시보드 & Company (1일)
- [ ] `app/admin/page.tsx` 구현
- [ ] `components/admin/CompanyList.tsx` 구현
- [ ] `components/admin/CompanyForm.tsx` 구현
- [ ] `app/admin/companies/page.tsx` 구현

### Phase 3: Project & Skill (2일)
- [ ] `components/admin/ProjectList.tsx` 구현
- [ ] `components/admin/ProjectForm.tsx` 구현
- [ ] `app/admin/projects/page.tsx` 구현
- [ ] `components/admin/SkillList.tsx` 구현
- [ ] `components/admin/SkillForm.tsx` 구현
- [ ] `app/admin/skills/page.tsx` 구현

### Phase 4: 검증 & QA (1일)
- [ ] 모든 폼 검증 동작 확인
- [ ] 모바일/PC 반응형 확인
- [ ] 다크/라이트 모드 확인
- [ ] API 에러 처리 확인
- [ ] TypeScript 타입 검증 (`npx tsc --noEmit`)
- [ ] 빌드 성공 확인 (`npm run build`)

---

## 18. 주의사항

1. **techStack, achievements는 JSON 직렬화**
   ```typescript
   // 저장할 때
   const input = {
     techStack: JSON.stringify(['React', 'Next.js']),
     achievements: JSON.stringify(['성과1', '성과2']),
   }

   // 표시할 때
   const techStack = JSON.parse(project.techStack) as string[]
   ```

2. **isCurrent=true일 때 endDate는 null**
   ```typescript
   endDate: formData.isCurrent ? null : formData.endDate
   ```

3. **쿠키는 자동 관리됨**
   - 로그인: `/api/admin/login`이 `admin_token` 쿠키 설정
   - 로그아웃: `/api/admin/logout`이 쿠키 삭제
   - 프론트엔드에서는 직접 조작 불필요

4. **날짜 형식**
   - 입력: `YYYY-MM-DD` (input type="date")
   - API: ISO 형식 (예: `2023-01-15T00:00:00.000Z`)
   - 표시: `new Date(iso).toLocaleDateString('ko-KR')`

5. **테이블 스크롤**
   - 모바일에서는 `overflow-x-auto`로 수평 스크롤 가능하게 구현

---

## 19. 참고: 기존 API 응답 형식

### GET /api/companies
```json
{
  "data": [
    {
      "id": 1,
      "name": "당근마켓",
      "role": "Senior Frontend Engineer",
      "startDate": "2023-01-15T00:00:00.000Z",
      "endDate": null,
      "isCurrent": true,
      "description": "...",
      "logoUrl": null,
      "createdAt": "2026-03-05T...",
      "updatedAt": "2026-03-05T...",
      "projects": [...]
    }
  ]
}
```

### GET /api/projects
```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "title": "당근마켓 앱 V2",
        "description": "...",
        "techStack": "[\"React\",\"Next.js\"]",
        "achievements": "[\"성과1\",\"성과2\"]",
        "thumbnailUrl": null,
        "githubUrl": null,
        "demoUrl": null,
        "companyId": 1,
        "createdAt": "2026-03-05T...",
        "updatedAt": "2026-03-05T...",
        "company": {...}
      }
    ],
    "nextCursor": null
  }
}
```

### GET /api/skills
```json
{
  "data": {
    "Frontend": [
      {
        "id": 1,
        "name": "React",
        "category": "Frontend",
        "proficiency": 5,
        "iconUrl": null,
        "sortOrder": 0,
        "createdAt": "2026-03-05T...",
        "updatedAt": "2026-03-05T..."
      }
    ],
    "Backend": [...],
    "Database": [...],
    "DevOps": [...],
    "Tool": [...]
  }
}
```

---

**문서 완성일**: 2026-03-09
**FE 개발 시작 예정**: Sprint 2 Phase 2
