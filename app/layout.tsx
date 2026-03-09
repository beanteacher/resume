import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

const BASE_URL = 'https://resume-nine-gold.vercel.app'
const DESCRIPTION = '데이터의 안정성과 품질 보장에 깊은 관심을 가진 백엔드 개발자 오민성의 포트폴리오입니다.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: '오민성 | Backend Developer',
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: '오민성 포트폴리오',
    title: '오민성 | Backend Developer',
    description: DESCRIPTION,
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '오민성 | Backend Developer',
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
