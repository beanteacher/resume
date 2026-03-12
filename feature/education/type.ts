export type EducationDto = {
  id: number
  name: string
  course: string
  type: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string | null
  createdAt: string
  updatedAt: string
}

export type EducationFormData = {
  name: string
  course: string
  type: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
}

export type EducationInput = {
  name: string
  course: string
  type: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  description: string | null
}
