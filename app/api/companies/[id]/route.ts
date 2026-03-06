import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) },
      include: { projects: true },
    })
    if (!company) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: '회사를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse<typeof company>>({ data: company })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '회사 정보를 불러올 수 없습니다.' },
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
      role: string
      description: string
      startDate: string
      endDate?: string
      isCurrent: boolean
    }

    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        role: body.role,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent,
      },
    })

    return NextResponse.json<ApiResponse<typeof company>>({ data: company })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '회사 정보를 수정할 수 없습니다.' },
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
    await prisma.company.delete({ where: { id: parseInt(id) } })
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true } })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '회사 정보를 삭제할 수 없습니다.' },
      { status: 500 }
    )
  }
}
