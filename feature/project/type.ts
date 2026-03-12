import type { CompanyDto } from '@/feature/company/type'

export type ProjectDto = {
  id: number
  title: string
  description: string
  techStack: string
  achievements: string
  thumbnailUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  companyId: number | null
  createdAt: string
  updatedAt: string
  company: CompanyDto | null
}

export type ProjectFormData = {
  title: string
  description: string
  techStack: string
  achievements: string
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
  companyId: number | null
  githubUrl: string | null
  demoUrl: string | null
  thumbnailUrl: string | null
}
