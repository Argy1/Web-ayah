// src/pages/admin/edit.tsx
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import AdminEditClient from '../../components/AdminEditClient'
import { prisma } from '../../lib/prisma'
import {
  ProfileData,
  PageContentData,
  JourneyItem,
  MemoryItem,
  PostItem,
  EditPageProps,
} from '../../types/admin'

export const getServerSideProps: GetServerSideProps<EditPageProps> = async (
  ctx
) => {
  // 1) cek session + role
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return { redirect: { destination: '/login', permanent: false } }
  }

  // 2) ambil profil
  const rawProfile = await prisma.profile.findFirst()
  if (!rawProfile) {
    return {
      props: {
        page: 'profile',
        initialProfile: {
          id: 0,
          photo: '',
          about: '',
          education: [],
          experience: [],
          skills: [],
          contact: {
            location: '',
            phone: '',
            email: '',
            linkedin: '',
            github: '',
            twitter: '',
          },
        },
        initialContent: { page: 'profile', title: '', body: '' },
        initialJourney: [],
        initialMemory: [],
        posts: [],
      },
    }
  }

  // 3) normalize education & skills & experience
  const education: string[] = Array.isArray(rawProfile.education)
    ? rawProfile.education.filter((v): v is string => typeof v === 'string')
    : []
  const skills: string[] = Array.isArray(rawProfile.skills)
    ? rawProfile.skills.filter((v): v is string => typeof v === 'string')
    : []
  const experience = Array.isArray(rawProfile.experience)
    ? (rawProfile.experience as any[]).map((e) => ({
        title: typeof e.title === 'string' ? e.title : '',
        period: typeof e.period === 'string' ? e.period : '',
        desc: typeof e.desc === 'string' ? e.desc : '',
      }))
    : []

  // 4) parse contact JSON
  const contactRaw = (rawProfile.contact as Record<string, string>) || {}
  const initialProfile: ProfileData = {
    id: rawProfile.id,
    photo: rawProfile.photo,
    about: rawProfile.about,
    education,
    experience,
    skills,
    contact: {
      location: contactRaw.location ?? '',
      phone: contactRaw.phone ?? '',
      email: contactRaw.email ?? '',
      linkedin: contactRaw.linkedin ?? '',
      github: contactRaw.github ?? '',
      twitter: contactRaw.twitter ?? '',
    },
  }

  // 5) ambil page content
  const rawContent = await prisma.pageContent.findUnique({
    where: { page: 'profile' },
  })
  const initialContent: PageContentData = {
    page: rawContent?.page ?? 'profile',
    title: rawContent?.title ?? '',
    body: rawContent?.body ?? '',
  }

  // 6) perjalanan hidup
  const journeyRaw = await prisma.journeyItem.findMany({
    orderBy: { order: 'asc' },
  })
  const initialJourney: JourneyItem[] = journeyRaw.map((it) => ({
    id: it.id,
    order: it.order,
    title: it.title,
    period: it.period,
    description: it.description,
    image: it.image,
  }))

  // 7) galeri kenangan
  const memoryRaw = await prisma.memoryItem.findMany({
    orderBy: { order: 'asc' },
  })
  const initialMemory: MemoryItem[] = memoryRaw.map((it) => ({
    id: it.id,
    order: it.order,
    label: it.label,
    date: it.date.toISOString(),
    location: it.location,
    description: it.description,
    isFavorite: it.isFavorite,
    image: it.image,
  }))

  // 8) blog posts
  const postsRaw = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
  })
  const posts: PostItem[] = postsRaw.map((p) => ({
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
      page: 'profile',
      initialProfile,
      initialContent,
      initialJourney,
      initialMemory,
      posts,
    },
  }
}

export default function EditAdminPage(props: EditPageProps) {
  return <AdminEditClient {...props} />
}
