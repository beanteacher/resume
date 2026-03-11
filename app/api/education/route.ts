import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, SerializedEducation } from '@/types'

export async function GET() {
  try {
    const educations = await prisma.education.findMany({ orderBy: { startDate: 'desc' } })
    const serialized: SerializedEducation[] = educations.map((e) => ({
      id: e.id,
      name: e.name,
      course: e.course,
      type: e.type,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate ? e.endDate.toISOString() : null,
      isCurrent: e.isCurrent,
      description: e.description,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }))
    return NextResponse.json<ApiResponse<SerializedEducation[]>>({ data: serialized })
  } catch {
    return NextResponse.json<ApiResponse<SerializedEducation[]>>(
      { data: [], error: '학력/교육 정보를 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string
      course: string
      type: string
      startDate: string
      endDate?: string | null
      isCurrent: boolean
      description?: string | null
    }

    const education = await prisma.education.create({
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
      { data: null, error: '학력/교육 정보를 생성할 수 없습니다.' },
      { status: 500 }
    )
  }
}
