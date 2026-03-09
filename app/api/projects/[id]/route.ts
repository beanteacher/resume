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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json() as {
      title: string
      description: string
      techStack: string[]
      achievements: string[]
      companyId?: number
      githubUrl?: string
      demoUrl?: string
      thumbnailUrl?: string
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
        techStack: JSON.stringify(body.techStack),
        achievements: JSON.stringify(body.achievements),
        companyId: body.companyId ?? null,
        githubUrl: body.githubUrl ?? null,
        demoUrl: body.demoUrl ?? null,
        thumbnailUrl: body.thumbnailUrl ?? null,
      },
    })

    return NextResponse.json<ApiResponse<typeof project>>({ data: project })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '프로젝트를 수정할 수 없습니다.' },
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
    await prisma.project.delete({ where: { id: parseInt(id) } })
    return NextResponse.json<ApiResponse<{ success: boolean }>>({ data: { success: true } })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '프로젝트를 삭제할 수 없습니다.' },
      { status: 500 }
    )
  }
}
