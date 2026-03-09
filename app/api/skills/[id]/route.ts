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
    const skill = await prisma.skill.findUnique({
      where: { id: parseInt(id) },
    })
    if (!skill) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: '스킬을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse<typeof skill>>({ data: skill })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '스킬을 불러올 수 없습니다.' },
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
      category: string
      proficiency: number
      iconUrl?: string
      sortOrder?: number
    }

    const skill = await prisma.skill.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        category: body.category,
        proficiency: body.proficiency,
        iconUrl: body.iconUrl ?? null,
        sortOrder: body.sortOrder ?? 0,
      },
    })

    revalidateTag('skills', {})
    return NextResponse.json<ApiResponse<typeof skill>>({ data: skill })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '스킬을 수정할 수 없습니다.' },
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
    await prisma.skill.delete({ where: { id: parseInt(id) } })
    revalidateTag('skills', {})
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true } })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '스킬을 삭제할 수 없습니다.' },
      { status: 500 }
    )
  }
}
