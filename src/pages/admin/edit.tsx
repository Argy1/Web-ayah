// src/pages/admin/edit.tsx
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
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
    return { redirect: { destination: '/login', permanent: false } }
  }

  // ambil data
  const rawProfile = await prisma.profile.findUnique({ where: { id: 1 } })
  const rawContent = await prisma.pageContent.findUnique({ where: { page: 'blog' } })
  const rawJourney = await prisma.journeyItem.findMany({ orderBy: { order: 'asc' } })
  const rawMemory = await prisma.memoryItem.findMany({ orderBy: { order: 'asc' } })
  const rawPosts   = await prisma.postItem.findMany({ orderBy: { date: 'desc' } })

  // serialize & fallback
  const initialProfile: ProfileData = {
    id: rawProfile!.id,
    photo: rawProfile!.photo,
    about: rawProfile!.about,
    education: rawProfile!.education ?? [],
    experience: rawProfile!.experience ?? [],
    skills: rawProfile!.skills ?? [],
    contact: rawProfile!.contact ?? { location: '', phone: '', email: '' },
    dob: rawProfile!.dob ? rawProfile!.dob.toISOString() : undefined,
  }
  const initialContent: PageContentData = {
    page: rawContent!.page,
    title: rawContent!.title,
    body: rawContent!.body,
  }
  const initialJourney: JourneyItem[] = rawJourney.map((j) => ({
    id: j.id, order: j.order, title: j.title, period: j.period, description: j.description, image: j.image,
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
    },
  }
}

export default function EditPage(props: EditPageProps) {
  return <AdminEditClient {...props} />
}
