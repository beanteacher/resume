import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'
import type { Profile } from '@prisma/client'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst()
    return NextResponse.json<ApiResponse<Profile | null>>({ data: profile })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '프로필을 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}
