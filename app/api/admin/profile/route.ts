import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/types'
import type { Profile } from '@prisma/client'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst()
    if (!profile) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: '프로필을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return NextResponse.json<ApiResponse<Profile>>({ data: profile })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '프로필을 불러올 수 없습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin_token')

  if (!adminToken) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '인증이 필요합니다.' },
      { status: 401 }
    )
  }

  const body = await request.json() as {
    name: string
    title: string
    bio: string
    email: string
    phone?: string
    location: string
    github: string
    linkedin?: string
    blog?: string
    avatarUrl?: string
  }

  const { name, title, bio, email, location, github } = body

  if (!name || !title || !bio || !email || !location || !github) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '필수 항목을 모두 입력해주세요.' },
      { status: 400 }
    )
  }

  try {
    const updatedProfile = await prisma.profile.upsert({
      where: { id: 1 },
      update: {
        name,
        title,
        bio,
        email,
        phone: body.phone,
        location,
        github,
        linkedin: body.linkedin,
        blog: body.blog,
        avatarUrl: body.avatarUrl,
      },
      create: {
        name,
        title,
        bio,
        email,
        phone: body.phone,
        location,
        github,
        linkedin: body.linkedin,
        blog: body.blog,
        avatarUrl: body.avatarUrl,
      },
    })

    try {
      revalidateTag('profile', 'max')
    } catch {
      // revalidateTag 실패는 응답에 영향 없음
    }

    return NextResponse.json<ApiResponse<Profile>>({ data: updatedProfile })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: '프로필 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}
