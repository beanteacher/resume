export type ApiResponse<T> = {
  data: T
  error?: string
}

export type SkillsByCategory = {
  [category: string]: Array<{
    id: number
    name: string
    category: string
    proficiency: number
    iconUrl: string | null
    sortOrder: number
  }>
}

export type ProjectData = {
  id: number
  title: string
  description: string
  techStack: string
  achievements: string
  thumbnailUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  companyId: number | null
}

export type CompanyWithProjects = {
  id: number
  name: string
  role: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string
  logoUrl: string | null
  projects: ProjectData[]
}

export type SerializedCompany = {
  id: number
  name: string
  role: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string
  logoUrl: string | null
  createdAt: string
  updatedAt: string
}

export type SerializedProject = {
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
  company: SerializedCompany | null
}
