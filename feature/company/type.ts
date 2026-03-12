export type CompanyDto = {
  id: number
  name: string
  role: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string
  responsibilities: string | null
  achievements: string | null
  logoUrl: string | null
  createdAt: string
  updatedAt: string
}

export type CompanyFormData = {
  name: string
  role: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  responsibilities: string
  achievements: string
  logoUrl: string
}

export type CompanyInput = {
  name: string
  role: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string
  responsibilities: string | null
  achievements: string | null
  logoUrl: string | null
}
