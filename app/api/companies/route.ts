import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { unstable_cache, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'

const getCachedCompanies = unstable_cache(
  async () => prisma.company.findMany({ include: { projects: true }, orderBy: { startDate: 'desc' } }),
  ['companies'],
  { revalidate: 300, tags: ['companies'] }
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string
      role: string
      description: string
      responsibilities?: string
      achievements?: string
      startDate: string
      endDate?: string
      isCurrent: boolean
      logoUrl?: string
    }

    const company = await prisma.company.create({
      data: {
        name: body.name,
        role: body.role,
        description: body.description,
        responsibilities: body.responsibilities ?? null,
        achievements: body.achievements ?? null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent,
        logoUrl: body.logoUrl ?? null,
      },
    })

    try { revalidateTag('companies', {}) } catch { /* ignore cache errors */ }
    return NextResponse.json<ApiResponse<typeof company>>({ data: company })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '회사 정보를 생성할 수 없습니다.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const companies = await getCachedCompanies()
    return NextResponse.json<ApiResponse<typeof companies>>({ data: companies })
  } catch {
    return NextResponse.json<ApiResponse<never[]>>(
      { data: [], error: '회사 정보를 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}
