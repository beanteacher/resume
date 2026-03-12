import type { ProfileDto, ProfileInput } from './type'
import type { ApiResponse } from '@/types'

export const profileApi = {
  get: async (): Promise<ProfileDto> => {
    const res = await fetch('/api/admin/profile')
    const json = (await res.json()) as ApiResponse<ProfileDto>
    if (!res.ok) throw new Error(json.error ?? '프로필을 불러올 수 없습니다.')
    return json.data
  },

  update: async (body: ProfileInput): Promise<ProfileDto> => {
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = (await res.json()) as ApiResponse<ProfileDto>
    if (!res.ok) throw new Error(json.error ?? '저장에 실패했습니다.')
    return json.data
  },
}
