import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/login은 인증 없이 허용
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin_token')?.value
  const secret = process.env.ADMIN_SECRET

  if (!token || token !== secret) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
