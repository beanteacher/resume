import type { PhilosophyDto, PhilosophyInput } from './type'
import type { ApiResponse } from '@/types'

export const philosophyApi = {
  getAll: async (): Promise<PhilosophyDto[]> => {
    const res = await fetch('/api/philosophy')
    const json = (await res.json()) as ApiResponse<PhilosophyDto[]>
    return json.data ?? []
  },

  getById: async (id: number): Promise<PhilosophyDto> => {
    const res = await fetch(`/api/philosophy/${id}`)
    const json = (await res.json()) as ApiResponse<PhilosophyDto>
    if (!res.ok) throw new Error(json.error ?? '가치관을 불러올 수 없습니다.')
    return json.data
  },

  create: async (body: PhilosophyInput): Promise<PhilosophyDto> => {
    const res = await fetch('/api/philosophy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<PhilosophyDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  update: async ({ id, ...body }: { id: number } & PhilosophyInput): Promise<PhilosophyDto> => {
    const res = await fetch(`/api/philosophy/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<PhilosophyDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`/api/philosophy/${id}`, { method: 'DELETE' })
  },
}
