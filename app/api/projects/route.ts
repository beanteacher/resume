import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') ? Number(searchParams.get('cursor')) : undefined
    const limit = Number(searchParams.get('limit') ?? '6')

    const projects = await prisma.project.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: { company: true },
      orderBy: { createdAt: 'desc' },
    })

    const hasMore = projects.length > limit
    const items = hasMore ? projects.slice(0, limit) : projects
    const nextCursor = hasMore ? items[items.length - 1].id : null

    return NextResponse.json<ApiResponse<{ items: typeof items; nextCursor: number | null }>>({
      data: { items, nextCursor },
    })
  } catch {
    return NextResponse.json<ApiResponse<{ items: never[]; nextCursor: null }>>(
      { data: { items: [], nextCursor: null }, error: '프로젝트를 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}
