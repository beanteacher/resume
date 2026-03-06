import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types'

export async function POST() {
  const response = NextResponse.json<ApiResponse<{ success: boolean }>>(
    { data: { success: true } }
  )
  response.cookies.delete('admin_token')
  return response
}
