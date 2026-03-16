'use client'

import { useEducationsQuery } from '@/feature/education/query'
import { EducationContent } from '@/components/sections/EducationContent'

export function EducationSection() {
  const { data: educations = [], isPending } = useEducationsQuery()

  if (isPending) return null

  return <EducationContent educations={educations} />
}
