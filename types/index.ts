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
