import type { CompanyDto, CompanyInput, CompanyWithProjects } from './type'
import type { ApiResponse } from '@/types'

export const companyApi = {
  getById: async (id: number): Promise<CompanyDto> => {
    const res = await fetch(`/api/company/${id}`)
    const json = (await res.json()) as ApiResponse<CompanyDto>
    if (!res.ok) throw new Error(json.error ?? '회사 정보를 불러올 수 없습니다.')
    return json.data
  },

  getAll: async (): Promise<CompanyDto[]> => {
    const res = await fetch('/api/company')
    const json = (await res.json()) as ApiResponse<CompanyDto[]>
    return json.data ?? []
  },

  getAllWithProjects: async (): Promise<CompanyWithProjects[]> => {
    const res = await fetch('/api/company')
    const json = (await res.json()) as ApiResponse<CompanyWithProjects[]>
    return json.data ?? []
  },

  create: async (body: CompanyInput): Promise<CompanyDto> => {
    const res = await fetch('/api/company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<CompanyDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  update: async ({ id, ...body }: { id: number } & CompanyInput): Promise<CompanyDto> => {
    const res = await fetch(`/api/company/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<CompanyDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`/api/company/${id}`, { method: 'DELETE' })
  },
}
