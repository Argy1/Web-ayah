// src/types/admin.ts

/**
 * Data profil utama
 */
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

/**
 * Konten halaman statis (judul + body HTML)
 * Untuk page “blog” juga akan digabungkan daftar PostItem di initialContent.posts
 */
export interface PageContentData {
  page: string
  title: string
  body: string
}

/**
 * Satu langkah/tahap perjalanan hidup
 */
export interface JourneyItem {
  id: number
  order: number
  title: string
  period: string
  description: string
  image: string
}

/**
 * Satu entry di galeri kenangan
 */
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

/**
 * Satu blog post
 */
export interface PostItem {
  id: number
  date: string     // YYYY-MM-DD
  title: string
  excerpt: string
  content: string
  image: string
}

/**
 * Props yang dikirim ke komponen AdminEditClient
 */
export interface EditPageProps {
  page: 'profile' | 'perjalanan-hidup' | 'galeri-kenangan' | 'blog'
  initialProfile: ProfileData
  // initialContent sekarang juga harus membawa .posts untuk page === 'blog'
  initialContent: PageContentData & { posts: PostItem[] }
  initialJourney: JourneyItem[]
  initialMemory: MemoryItem[]
}
