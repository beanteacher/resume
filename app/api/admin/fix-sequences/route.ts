import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Project"', 'id'), COALESCE((SELECT MAX(id) FROM "Project"), 0) + 1, false)`
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Company"', 'id'), COALESCE((SELECT MAX(id) FROM "Company"), 0) + 1, false)`
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Skill"', 'id'), COALESCE((SELECT MAX(id) FROM "Skill"), 0) + 1, false)`
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Education"', 'id'), COALESCE((SELECT MAX(id) FROM "Education"), 0) + 1, false)`
    return NextResponse.json({ ok: true, message: '모든 시퀀스 리셋 완료' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
