export type SkillDto = {
  id: number
  name: string
  category: string
  proficiency: number
  iconUrl: string | null
  sortOrder: number
}

export type SkillsByCategory = {
  [category: string]: SkillDto[]
}

export type SkillFormData = {
  name: string
  category: string
  proficiency: string
  iconUrl: string
  sortOrder: string
}

export type SkillInput = {
  name: string
  category: string
  proficiency: number
  iconUrl: string | null
  sortOrder?: number
}
