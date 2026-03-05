import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { company: true },
    })
    if (!project) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse<typeof project>>({ data: project })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '프로젝트를 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}
