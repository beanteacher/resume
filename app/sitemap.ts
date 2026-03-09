import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://resume-nine-gold.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({
    select: { id: true, updatedAt: true },
  })

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectEntries,
  ]
}
