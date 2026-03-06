import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  const body = await request.json() as { password: string }

  if (body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    )
  }

  const response = NextResponse.json<ApiResponse<{ success: boolean }>>(
    { data: { success: true } }
  )

  response.cookies.set('admin_token', process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  })

  return response
}
