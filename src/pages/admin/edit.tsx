// src/pages/admin/edit.tsx
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import {
  ProfileData,
  PageContentData,
  JourneyItem,
  MemoryItem,
  PostItem,
  EditPageProps,
} from '../../types/admin'

const AdminEditClient = dynamic(() => import('../../components/AdminEditClient'), {
  ssr: false,
})

export const getServerSideProps: GetServerSideProps<EditPageProps> = async (
  ctx: GetServerSidePropsContext
) => {
  // 1) cek session + role
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return {
      redirect: { destination: '/login', permanent: false },
    }
  }

  // 2) ambil profile (asumsikan hanya 1 row)
  const rawProfile = await prisma.profile.findFirst()
  const initialProfile: ProfileData = {
    id: rawProfile!.id,
    photo: rawProfile!.photo,
    about: rawProfile!.about,
    education: (rawProfile!.education as string[]) ?? [],
    experience: (rawProfile!.experience as { title: string; period: string; desc: string }[]) ?? [],
    skills: (rawProfile!.skills as string[]) ?? [],
    contact: {
      location: rawProfile!.contact.location,
      phone: rawProfile!.contact.phone,
      email: rawProfile!.contact.email,
      linkedin: rawProfile!.contact.linkedin,
      github: rawProfile!.contact.github,
      twitter: rawProfile!.contact.twitter,
    },
  }

  // 3) tentukan page dari query ?page=...
  const pageParam = Array.isArray(ctx.query.page) ? ctx.query.page[0] : ctx.query.page
  const page = (pageParam as EditPageProps['page']) || 'profile'

  // 4) ambil page content
  const rawContent = await prisma.pageContent.findUnique({
    where: { page },
  })
  const initialContent: PageContentData = {
    page: rawContent!.page,
    title: rawContent!.title,
    body: rawContent!.body,
  }

  // 5) ambil journey & memory
  const initialJourney: JourneyItem[] = await prisma.journeyItem.findMany({
    orderBy: { order: 'asc' },
  })
  const initialMemory: MemoryItem[] = await prisma.memoryItem.findMany({
    orderBy: { order: 'asc' },
  })

  // 6) untuk blog: ambil posts
  let posts: PostItem[] = []
  if (page === 'blog') {
    const dbPosts = await prisma.post.findMany({ orderBy: { date: 'desc' } })
    posts = dbPosts.map((p) => ({
      id: p.id,
      slug: p.slug,
      date: p.date.toISOString().slice(0, 10),
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      image: p.image,
    }))
  }

  return {
    props: {
      page,
      initialProfile,
      initialContent,
      initialJourney,
      initialMemory,
      posts, // optional, hanya terisi saat page==='blog'
    },
  }
}

export default function EditPage(props: EditPageProps) {
  return <AdminEditClient {...props} />
}
