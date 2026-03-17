import type { EducationDto, EducationInput, EducationWithProjects } from './type'
import type { ApiResponse } from '@/types'

export const educationApi = {
  getAll: async (): Promise<EducationWithProjects[]> => {
    const res = await fetch('/api/education')
    const json = (await res.json()) as ApiResponse<EducationWithProjects[]>
    return json.data ?? []
  },

  getById: async (id: number): Promise<EducationDto> => {
    const res = await fetch(`/api/education/${id}`)
    const json = (await res.json()) as ApiResponse<EducationDto>
    if (!res.ok) throw new Error(json.error ?? '학력/교육 정보를 불러올 수 없습니다.')
    return json.data
  },

  create: async (body: EducationInput): Promise<EducationDto> => {
    const res = await fetch('/api/education', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<EducationDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  update: async ({ id, ...body }: { id: number } & EducationInput): Promise<EducationDto> => {
    const res = await fetch(`/api/education/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<EducationDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`/api/education/${id}`, { method: 'DELETE' })
  },
}
