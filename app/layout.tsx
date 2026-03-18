import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://resume-nine-gold.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.profile.findFirst()

  const name = profile?.name ?? ''
  const title = profile?.title ?? ''
  const bio = profile?.bio ?? ''

  const pageTitle = name && title ? `${name} | ${title}` : name || title || 'Portfolio'
  const siteName = name ? `${name} 포트폴리오` : '포트폴리오'

  return {
    metadataBase: new URL(BASE_URL),
    title: pageTitle,
    description: bio,
    openGraph: {
      type: 'website',
      url: BASE_URL,
      siteName,
      title: pageTitle,
      description: bio,
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: bio,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
