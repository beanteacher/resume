import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as {
      updates: Array<{ id: number; sortOrder: number }>
    }

    await prisma.$transaction(
      body.updates.map(({ id, sortOrder }) =>
        prisma.skill.update({ where: { id }, data: { sortOrder } })
      )
    )

    try { revalidateTag('skills') } catch { /* ignore cache errors */ }
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true } })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '정렬 순서를 업데이트할 수 없습니다.' },
      { status: 500 }
    )
  }
}
