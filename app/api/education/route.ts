import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { unstable_cache, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, SerializedEducation } from '@/types'

const getCachedEducation = unstable_cache(
  async (): Promise<SerializedEducation[]> => {
    const educations = await prisma.education.findMany({ orderBy: { startDate: 'desc' } })
    return educations.map((e) => ({
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
  },
  ['education'],
  { revalidate: 300, tags: ['education'] }
)

export async function GET() {
  try {
    const serialized = await getCachedEducation()
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

    revalidateTag('education', {})
    return NextResponse.json<ApiResponse<typeof education>>({ data: education })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '학력/교육 정보를 생성할 수 없습니다.' },
      { status: 500 }
    )
  }
}
