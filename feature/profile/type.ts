export type ProfileDto = {
  id: number
  name: string
  title: string
  tagline: string | null
  bio: string
  email: string
  phone: string | null
  location: string
  github: string
  linkedin: string | null
  blog: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export type ProfileFormData = {
  name: string
  title: string
  tagline: string
  bio: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  blog: string
  avatarUrl: string
}

export type ProfileInput = {
  name: string
  title: string
  tagline?: string
  bio: string
  email: string
  phone?: string
  location: string
  github: string
  linkedin?: string
  blog?: string
  avatarUrl?: string
}
