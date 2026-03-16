import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'
import type { PhilosophyDto } from '@/feature/philosophy/type'

function serialize(p: { id: number; icon: string; title: string; desc: string; createdAt: Date; updatedAt: Date }): PhilosophyDto {
  return { id: p.id, icon: p.icon, title: p.title, desc: p.desc, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await prisma.philosophy.findUnique({ where: { id: parseInt(id) } })
    if (!item) {
      return NextResponse.json<ApiResponse<null>>({ data: null, error: '가치관을 찾을 수 없습니다.' }, { status: 404 })
    }
    return NextResponse.json<ApiResponse<PhilosophyDto>>({ data: serialize(item) })
  } catch {
    return NextResponse.json<ApiResponse<null>>({ data: null, error: '가치관을 불러올 수 없습니다.' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  if (!cookieStore.get('admin_token')) {
    return NextResponse.json<ApiResponse<null>>({ data: null, error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json() as { icon: string; title: string; desc: string }
    const item = await prisma.philosophy.update({
      where: { id: parseInt(id) },
      data: { icon: body.icon, title: body.title, desc: body.desc },
    })
    try { revalidateTag('philosophy', 'max') } catch { /* ignore */ }
    return NextResponse.json<ApiResponse<PhilosophyDto>>({ data: serialize(item) })
  } catch {
    return NextResponse.json<ApiResponse<null>>({ data: null, error: '가치관을 수정할 수 없습니다.' }, { status: 500 })
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  if (!cookieStore.get('admin_token')) {
    return NextResponse.json<ApiResponse<null>>({ data: null, error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.philosophy.delete({ where: { id: parseInt(id) } })
    try { revalidateTag('philosophy', 'max') } catch { /* ignore */ }
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true } })
  } catch {
    return NextResponse.json<ApiResponse<null>>({ data: null, error: '가치관을 삭제할 수 없습니다.' }, { status: 500 })
  }
}
