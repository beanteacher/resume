import type { SkillDto, SkillsByCategory, SkillInput } from './type'
import type { ApiResponse } from '@/types'

export const skillApi = {
  getAll: async (): Promise<SkillsByCategory> => {
    const res = await fetch('/api/skill')
    const json = (await res.json()) as ApiResponse<SkillsByCategory>
    return json.data ?? {}
  },

  getById: async (id: number): Promise<SkillDto> => {
    const res = await fetch(`/api/skill/${id}`)
    const json = (await res.json()) as ApiResponse<SkillDto>
    if (!res.ok) throw new Error(json.error ?? '스킬을 불러올 수 없습니다.')
    return json.data
  },

  create: async (body: SkillInput): Promise<SkillDto> => {
    const res = await fetch('/api/skill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<SkillDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  update: async ({ id, ...body }: { id: number } & SkillInput): Promise<SkillDto> => {
    const res = await fetch(`/api/skill/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<SkillDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`/api/skill/${id}`, { method: 'DELETE' })
  },

  reorder: async (updates: Array<{ id: number; sortOrder: number }>): Promise<void> => {
    await fetch('/api/skill/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    })
  },
}
