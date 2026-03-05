import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: { projects: true },
      orderBy: { startDate: 'desc' },
    })
    return NextResponse.json<ApiResponse<typeof companies>>({ data: companies })
  } catch {
    return NextResponse.json<ApiResponse<never[]>>(
      { data: [], error: '회사 정보를 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}
