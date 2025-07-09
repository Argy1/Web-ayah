// src/pages/admin/edit.tsx

import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import {
  ProfileData,
  PageContentData,
  JourneyItem,
  MemoryItem,
  PostItem,
  EditPageProps,
} from '../../types/admin'

export const getServerSideProps: GetServerSideProps<EditPageProps> = async (ctx) => {
  // 1) Cek session + role
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return { redirect: { destination: '/login', permanent: false } }
  }

  // 2) Ambil data dari Prisma
  const rawProfile = await prisma.profile.findFirst()
  const rawContent = await prisma.pageContent.findFirst({ where: { page: ctx.query.page as string } })
  const rawJourney = await prisma.journeyItem.findMany({ orderBy: { order: 'asc' } })
  const rawMemory = await prisma.memoryItem.findMany({ orderBy: { order: 'asc' } })
  const rawPosts = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } })

  if (!rawProfile || !rawContent) {
    return { notFound: true }
  }

  // 3) Bersihkan & type-guard JSON fields
  const education = Array.isArray(rawProfile.education)
    ? rawProfile.education.filter((e): e is string => typeof e === 'string')
    : []

  const experience = Array.isArray(rawProfile.experience)
    ? rawProfile.experience.filter(
        (exp): exp is { title: string; period: string; desc: string } =>
          typeof exp === 'object' &&
          exp !== null &&
          'title' in exp &&
          'period' in exp &&
          'desc' in exp
      )
    : []

  const skills = Array.isArray(rawProfile.skills)
    ? rawProfile.skills.filter((s): s is string => typeof s === 'string')
    : []

  const contact = ((): ProfileData['contact'] => {
    const c = rawProfile.contact
    if (typeof c === 'object' && c !== null) {
      const { location, phone, email, linkedin, github, twitter } = c as Record<string, unknown>
      return {
        location: typeof location === 'string' ? location : '',
        phone: typeof phone === 'string' ? phone : '',
        email: typeof email === 'string' ? email : '',
        linkedin: typeof linkedin === 'string' ? linkedin : '',
        github: typeof github === 'string' ? github : '',
        twitter: typeof twitter === 'string' ? twitter : '',
      }
    }
    // fallback, tapi seharusnya tidak pernah jalan karena di Prisma schema non-nullable
    return { location: '', phone: '', email: '', linkedin: '', github: '', twitter: '' }
  })()

  // 4) Bentuk object sesuai interface
  const initialProfile: ProfileData = {
    id: rawProfile.id,
    photo: rawProfile.photo,
    about: rawProfile.about,
    education,
    experience,
    skills,
    contact,
  }

  const initialContent: PageContentData = {
    page: rawContent.page,
    title: rawContent.title,
    body: rawContent.body,
  }

  const initialJourney: JourneyItem[] = rawJourney.map((j) => ({
    id: j.id,
    order: j.order,
    title: j.title,
    period: j.period,
    description: j.description,
    image: j.image,
  }))

  const initialMemory: MemoryItem[] = rawMemory.map((m) => ({
    id: m.id,
    order: m.order,
    label: m.label,
    date: m.date.toISOString(),
    location: m.location,
    description: m.description,
    isFavorite: m.isFavorite,
    image: m.image,
  }))

  const initialPosts: PostItem[] = rawPosts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.date.toISOString(),
    excerpt: p.excerpt,
    content: p.content,
    image: p.image,
  }))

  return {
    props: {
      page: ctx.query.page as EditPageProps['page'],
      initialProfile,
      initialContent,
      initialJourney,
      initialMemory,
      initialPosts,
    }
  }
}

export default function AdminEditPage(props: EditPageProps) {
  return <AdminEditClient {...props} />
}

