// src/types/admin.ts

export interface ProfileData {
  id: number
  photo: string
  about: string
  education: string[]
  experience: Array<{
    title: string
    period: string
    desc: string
  }>
  skills: string[]
  contact: {
    location: string
    phone: string
    email: string
    linkedin: string
    github: string
    twitter: string
  }
}

export interface PageContentData {
  page: 'profile' | 'perjalanan-hidup' | 'galeri-kenangan' | 'blog'
  title: string
  body: string
}

export interface JourneyItem {
  id: number
  order: number
  title: string
  period: string
  description: string
  image: string
}

export interface MemoryItem {
  id: number
  order: number
  label: string
  date: string
  location: string
  description: string
  isFavorite: boolean
  image: string
}

export interface PostItem {
  id: number
  slug: string
  title: string
  date: string      // ISO string
  excerpt: string
  content: string
  image: string
}

export interface EditPageProps {
  page: 'profile' | 'perjalanan-hidup' | 'galeri-kenangan' | 'blog'
  initialProfile: ProfileData
  initialContent: PageContentData
  initialJourney: JourneyItem[]
  initialMemory: MemoryItem[]
  initialPosts: PostItem[]         // ⬅️ baru
}
