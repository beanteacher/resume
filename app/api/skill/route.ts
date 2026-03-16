import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'
import type { SkillsByCategory } from '@/feature/skill/type'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string
      category: string
      proficiency: number
      iconUrl?: string
      sortOrder?: number
    }

    const skill = await prisma.$transaction(async (tx) => {
      const maxResult = await tx.skill.aggregate({
        where: { category: body.category },
        _max: { sortOrder: true },
      })
      const nextOrder = (maxResult._max.sortOrder ?? 0) + 1
      return tx.skill.create({
        data: {
          name: body.name,
          category: body.category,
          proficiency: body.proficiency,
          iconUrl: body.iconUrl ?? null,
          sortOrder: body.sortOrder ?? nextOrder,
        },
      })
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

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    })
    const grouped = skills.reduce<SkillsByCategory>((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    }, {})
    return NextResponse.json<ApiResponse<SkillsByCategory>>({ data: grouped })
  } catch {
    return NextResponse.json<ApiResponse<SkillsByCategory>>(
      { data: {}, error: '기술 스택을 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}
