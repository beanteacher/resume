import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const education = await prisma.education.findUnique({
      where: { id: parseInt(id) },
    })
    if (!education) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: '학력/교육 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse<typeof education>>({ data: education })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '학력/교육 정보를 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json() as {
      name: string
      course: string
      type: string
      startDate: string
      endDate?: string | null
      isCurrent: boolean
      description?: string | null
    }

    const education = await prisma.education.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        course: body.course,
        type: body.type,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent,
        description: body.description ?? null,
      },
    })

    try { revalidateTag('education', {}) } catch { /* ignore cache errors */ }
    return NextResponse.json<ApiResponse<typeof education>>({ data: education })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '학력/교육 정보를 수정할 수 없습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.education.delete({ where: { id: parseInt(id) } })
    try { revalidateTag('education', {}) } catch { /* ignore cache errors */ }
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true } })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '학력/교육 정보를 삭제할 수 없습니다.' },
      { status: 500 }
    )
  }
}
