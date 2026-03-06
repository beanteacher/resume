import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, SkillsByCategory } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string
      category: string
      proficiency: number
    }

    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
        proficiency: body.proficiency,
      },
    })

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
