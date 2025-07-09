// src/types/admin.ts

export interface ProfileData {
  photo: string
  about: string
  education: string[]
  experience: {
    title: string
    period: string
    desc: string
  }[]
  skills: string[]
  dob?: Date

  // Contact sekarang mendukung juga social links
  contact: {
    location: string
    phone: string
    email: string
    linkedin?: string
    github?: string
    twitter?: string
  }
}

export interface PageContentData {
  page: string
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
  image: string
   date: string
  location: string
  isFavorite: boolean
}

// Props yang dikirimkan ke AdminEditClient
export interface EditPageProps {
  page: 'profile' | 'perjalanan-hidup' | 'galeri-kenangan' | 'blog' | 'motivasi-inspirasi' | 'pelajaran-hidup'
  initialProfile?: ProfileData
  initialContent: PageContentData
  initialJourney: JourneyItem[]
  initialMemory: MemoryItem[]
}
