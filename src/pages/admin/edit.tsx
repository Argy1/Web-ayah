// src/pages/admin/edit.tsx
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import AdminEditClient from '../../components/AdminEditClient'
import {
  ProfileData,
  PageContentData,
  JourneyItem,
  MemoryItem,
  PostItem,
  EditPageProps,
} from '../../types/admin'

export const getServerSideProps: GetServerSideProps<EditPageProps> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return {
      redirect: { destination: '/login', permanent: false }
    }
  }

  // ambil data profil, konten halaman, perjalanan, memori, dan post blog
  const rawProfile = await prisma.profile.findFirst()
  const rawContent = await prisma.pageContent.findUnique({
    where: { page: 'blog' },
  })
  const rawJourney = await prisma.journeyItem.findMany({ orderBy: { order: 'asc' } })
  const rawMemory = await prisma.memoryItem.findMany({ orderBy: { order: 'asc' } })
  const rawPosts = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } })

  // serialisasi dan pastikan tipe sesuai
  const profile: ProfileData = {
    id: rawProfile!.id,
    photo: rawProfile!.photo,
    about: rawProfile!.about,
    education: Array.isArray(rawProfile!.education) ? rawProfile!.education : [],
    experience: Array.isArray(rawProfile!.experience)
      ? rawProfile!.experience
      : [],
    skills: Array.isArray(rawProfile!.skills) ? rawProfile!.skills : [],
    contact: {
      location: rawProfile!.contact.location,
      phone: rawProfile!.contact.phone,
      email: rawProfile!.contact.email,
      linkedin: rawProfile!.contact.linkedin,
      github: rawProfile!.contact.github,
      twitter: rawProfile!.contact.twitter,
    },
  }

  const content: PageContentData = {
    page: rawContent!.page,
    title: rawContent!.title,
    body: rawContent!.body,
  }

  const journey: JourneyItem[] = rawJourney.map((j) => ({
    id: j.id,
    order: j.order,
    title: j.title,
    period: j.period,
    description: j.description,
    image: j.image,
  }))

  const memory: MemoryItem[] = rawMemory.map((m) => ({
    id: m.id,
    order: m.order,
    label: m.label,
    date: m.date.toISOString(),
    location: m.location,
    description: m.description,
    isFavorite: m.isFavorite,
    image: m.image,
  }))

  const posts: PostItem[] = rawPosts.map((p) => ({
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
      initialProfile: profile,
      initialContent: content,
      initialJourney: journey,
      initialMemory: memory,
      initialPosts: posts,            // ⬅️ kirim ke client
    }
  }
}

export default function Page(props: EditPageProps) {
  return <AdminEditClient {...props} />
}
