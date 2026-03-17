import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      title: string
      description: string
      techStack: string[]
      achievements: string[]
      startDate?: string
      endDate?: string
      companyId?: number
      educationId?: number
      githubUrl?: string
      demoUrl?: string
      thumbnailUrl?: string
      codeSnippets?: { title: string; language: string; code: string; sortOrder: number }[]
    }

    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        techStack: JSON.stringify(body.techStack),
        achievements: JSON.stringify(body.achievements),
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        companyId: body.companyId ?? null,
        educationId: body.educationId ?? null,
        githubUrl: body.githubUrl ?? null,
        demoUrl: body.demoUrl ?? null,
        thumbnailUrl: body.thumbnailUrl ?? null,
        codeSnippets: body.codeSnippets?.length
          ? { create: body.codeSnippets }
          : undefined,
      },
      include: { company: true, education: true, codeSnippets: { orderBy: { sortOrder: 'asc' } } },
    })

    try { revalidateTag('projects', {}) } catch { /* ignore cache errors */ }
    return NextResponse.json<ApiResponse<typeof project>>({ data: project })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: msg },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') ? Number(searchParams.get('cursor')) : undefined
    const limit = Number(searchParams.get('limit') ?? '6')
    const standalone = searchParams.get('standalone') === 'true'

    const projects = await prisma.project.findMany({
      where: standalone ? { companyId: null, educationId: null } : undefined,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: { company: true, education: true, codeSnippets: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ startDate: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
    })
    const hasMore = projects.length > limit
    const items = hasMore ? projects.slice(0, limit) : projects
    const nextCursor = hasMore ? items[items.length - 1].id : null
    const data = { items, nextCursor }
    return NextResponse.json<ApiResponse<typeof data>>({ data })
  } catch {
    return NextResponse.json<ApiResponse<{ items: never[]; nextCursor: null }>>(
      { data: { items: [], nextCursor: null }, error: '프로젝트를 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}
