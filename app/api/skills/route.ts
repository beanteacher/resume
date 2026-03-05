import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, SkillsByCategory } from '@/types'

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
