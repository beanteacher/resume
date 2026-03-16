import type { CompanyDto } from '@/feature/company/type'

export type CodeSnippetDto = {
  id: number
  title: string
  language: string
  code: string
  sortOrder: number
}

export type CodeSnippetInput = {
  title: string
  language: string
  code: string
  sortOrder: number
}

export type ProjectDto = {
  id: number
  title: string
  description: string
  techStack: string
  achievements: string
  startDate: string | null
  endDate: string | null
  thumbnailUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  companyId: number | null
  createdAt: string
  updatedAt: string
  company: CompanyDto | null
  codeSnippets: CodeSnippetDto[]
}

export type ProjectFormData = {
  title: string
  description: string
  techStack: string
  achievements: string
  startDate: string
  endDate: string
  companyId: string
  githubUrl: string
  demoUrl: string
  thumbnailUrl: string
}

export type ProjectInput = {
  title: string
  description: string
  techStack: string[]
  achievements: string[]
  startDate: string | null
  endDate: string | null
  companyId: number | null
  githubUrl: string | null
  demoUrl: string | null
  thumbnailUrl: string | null
  codeSnippets: CodeSnippetInput[]
}
