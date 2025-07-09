// src/pages/admin/edit.tsx
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import {
  ProfileData,
  PageContentData,
  JourneyItem,
  MemoryItem,
  PostItem,           // <-- Ganti BlogPost ke PostItem
  EditPageProps,
} from '../../types/admin'

// Lazy-load client component karena kita pakai banyak 'useState' & 'framer-motion'
const AdminEditClient = dynamic(
  () => import('../../components/AdminEditClient'),
  { ssr: false }
)

export const getServerSideProps: GetServerSideProps<EditPageProps> = async (ctx) => {
  // Cek session + role
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return {
      redirect: { destination: '/login', permanent: false }
    }
  }

  // Ambil data profile
  const profile = await prisma.profile.findFirst()

  // Tentukan page dari query ?page=profile|perjalanan-hidup|galeri-kenangan|blog
  const page = Array.isArray(ctx.query.page)
    ? ctx.query.page[0]
    : ctx.query.page || 'profile'

  // Ambil konten statis
  const pageContent = await prisma.pageContent.findUnique({
    where: { page }
  })

  // Ambil journey & memory
  const journeyItems = await prisma.journeyItem.findMany({
    orderBy: { order: 'asc' }
  })
  const memoryItems = await prisma.memoryItem.findMany({
    orderBy: { order: 'asc' }
  })

  // Hanya untuk page==='blog', ambil semua post
  let posts: PostItem[] = []
  if (page === 'blog') {
    const dbPosts = await prisma.post.findMany({
      orderBy: { date: 'desc' }
    })
    posts = dbPosts.map(p => ({
      id: p.id,
      date: p.date.toISOString().slice(0, 10),
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      image: p.image
    }))
  }

  return {
    props: {
      page: page as EditPageProps['page'],
      initialProfile: {
        id: profile.id,
        photo: profile.photo,
        about: profile.about,
        education: profile.education,
        experience: profile.experience,
        skills: profile.skills,
        contact: profile.contact
      },
      initialContent: {
        page: pageContent.page,
        title: pageContent.title,
        body: pageContent.body,
        posts        // <-- sertakan daftar posts di initialContent
      },
      initialJourney: journeyItems,
      initialMemory: memoryItems
    }
  }
}

export default function EditPage(props: EditPageProps) {
  return <AdminEditClient {...props} />
}
