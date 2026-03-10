import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { unstable_cache, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, SkillsByCategory } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string
      category: string
      proficiency: number
      iconUrl?: string
      sortOrder?: number
    }

    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
        proficiency: body.proficiency,
        iconUrl: body.iconUrl ?? null,
        sortOrder: body.sortOrder ?? 0,
      },
    })

    try { revalidateTag('skills', {}) } catch { /* ignore cache errors */ }
    return NextResponse.json<ApiResponse<typeof skill>>({ data: skill })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '스킬을 생성할 수 없습니다.' },
      { status: 500 }
    )
  }
}

const getCachedSkills = unstable_cache(
  async () => {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    })
    return skills.reduce<SkillsByCategory>((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    }, {})
  },
  ['skills'],
  { revalidate: 300, tags: ['skills'] }
)

export async function GET() {
  try {
    const grouped = await getCachedSkills()
    return NextResponse.json<ApiResponse<SkillsByCategory>>({ data: grouped })
  } catch {
    return NextResponse.json<ApiResponse<SkillsByCategory>>(
      { data: {}, error: '기술 스택을 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}
