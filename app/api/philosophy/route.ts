import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'
import type { PhilosophyDto } from '@/feature/philosophy/type'

export async function GET() {
  try {
    const items = await prisma.philosophy.findMany({ orderBy: { createdAt: 'asc' } })
    const serialized: PhilosophyDto[] = items.map((p) => ({
      id: p.id,
      icon: p.icon,
      title: p.title,
      desc: p.desc,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))
    return NextResponse.json<ApiResponse<PhilosophyDto[]>>({ data: serialized })
  } catch {
    return NextResponse.json<ApiResponse<PhilosophyDto[]>>(
      { data: [], error: '가치관 목록을 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  if (!cookieStore.get('admin_token')) {
    return NextResponse.json<ApiResponse<null>>({ data: null, error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const body = await request.json() as { icon: string; title: string; desc: string }
    const item = await prisma.philosophy.create({ data: { icon: body.icon, title: body.title, desc: body.desc } })
    const serialized: PhilosophyDto = { ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() }
    try { revalidateTag('philosophy', 'max') } catch { /* ignore */ }
    return NextResponse.json<ApiResponse<PhilosophyDto>>({ data: serialized })
  } catch {
    return NextResponse.json<ApiResponse<null>>({ data: null, error: '가치관을 생성할 수 없습니다.' }, { status: 500 })
  }
}
