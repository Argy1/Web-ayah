// src/types/admin.ts

export type ProfileData = {
  id: number
  photo: string
  about: string
  education: string[]                   // daftar baris teks
  experience: { title: string; period: string; desc: string }[]
  skills: string[]                      // daftar kata kunci
  dob: string | null                    // ISO date string
  contact: { location: string; phone: string; email: string }
  social: { linkedin: string; github: string; twitter: string }
  updatedAt: string                     // ISO date
}

export type PageContentData = {
  page: string
  title: string
  body: string
  updatedAt: string                     // ISO date
}

export type JourneyItem = {
  id: number
  order: number
  title: string
  period: string
  description: string
  image: string
}

export type MemoryItem = {
  id: number
  order: number
  label: string
  image: string
}

// Tipe baru untuk blog post
export type PostItem = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string                          // ISO date string
}

export type EditPageProps = {
  page: 'profile'
       | 'perjalanan-hidup'
       | 'galeri-kenangan'
       | 'blog'
       | 'pelajaran-hidup'
       | 'motivasi-inspirasi'
       | string

  initialProfile?: ProfileData
  initialContent?: PageContentData
  initialJourney?: JourneyItem[]
  initialMemory?: MemoryItem[]
  initialPosts?: PostItem[]             // jika Anda passing daftar post
}
