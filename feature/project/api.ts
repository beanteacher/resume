import type { ProjectDto, ProjectInput } from './type'
import type { ApiResponse } from '@/types'

export const projectApi = {
  getAll: async (): Promise<ProjectDto[]> => {
    const res = await fetch('/api/project?limit=100')
    const json = (await res.json()) as ApiResponse<{ items: ProjectDto[]; nextCursor: number | null }>
    return json.data?.items ?? []
  },

  getStandalone: async (): Promise<ProjectDto[]> => {
    const res = await fetch('/api/project?standalone=true&limit=100')
    const json = (await res.json()) as ApiResponse<{ items: ProjectDto[]; nextCursor: number | null }>
    return json.data?.items ?? []
  },

  getById: async (id: number): Promise<ProjectDto> => {
    const res = await fetch(`/api/project/${id}`)
    const json = (await res.json()) as ApiResponse<ProjectDto>
    if (!res.ok) throw new Error(json.error ?? '프로젝트를 불러올 수 없습니다.')
    return json.data
  },

  create: async (body: ProjectInput): Promise<ProjectDto> => {
    const res = await fetch('/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<ProjectDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  update: async ({ id, ...body }: { id: number } & ProjectInput): Promise<ProjectDto> => {
    const res = await fetch(`/api/project/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<ProjectDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`/api/project/${id}`, { method: 'DELETE' })
  },
}
