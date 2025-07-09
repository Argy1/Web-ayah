// src/types/admin.ts
export type ExperienceItem = {
  title: string
  period: string
  desc: string
}

export type ContactInfo = {
  location: string
  birth: string
  phone: string
  email: string
  social: { linkedin: string; github: string; twitter: string }
}

export type ProfileData = {
  photo: string
  about: string
  education: string[]
  experience: ExperienceItem[]
  skills: string[]
  contact: ContactInfo
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

export type PageContentData = {
  page: string
  title: string
  body: string
}

export interface EditPageProps {
  page: string
  initialProfile: ProfileData
  initialContent: PageContentData
  initialJourney: JourneyItem[]
  initialMemory: MemoryItem[]
  initialBlog:    BlogPost[]         
}

export interface BlogPost {
  id:      number
  slug:    string
  title:   string
  date:    string
  excerpt: string
  content: string
  image:   string
}
