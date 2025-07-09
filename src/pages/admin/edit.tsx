// src/pages/admin/edit.tsx
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import AdminEditClient from '../../components/AdminEditClient'
import {
  ProfileData,
  PageContentData,
  JourneyItem,
  MemoryItem,
  BlogPost,
  EditPageProps,
} from '../../types/admin'

export default function AdminEditPage(props: EditPageProps) {
  return <AdminEditClient {...props} />
}

export const getServerSideProps: GetServerSideProps<EditPageProps> = async (ctx) => {
  // 1) Protect route
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return { redirect: { destination: '/login', permanent: false } }
  }

  // 2) Determine page to edit
  const page = (ctx.query.page as string) || 'profile'

  // 3) Fetch the single Profile row
  const prof = await prisma.profile.findFirst()

  // Normalize to strings before splitting
  const eduRaw = prof?.education ?? ''
  const expRaw = prof?.experience ?? ''
  const skillsRaw = prof?.skills ?? ''

  const initialProfile: ProfileData = {
    photo: prof?.photo ?? '',
    about: prof?.about ?? '',
    education:
      typeof eduRaw === 'string'
        ? eduRaw.split('\n').filter(Boolean)
        : [],
    experience:
      typeof expRaw === 'string'
        ? expRaw
            .split('\n')
            .filter(Boolean)
            .map((line) => {
              const [title, period, desc] = line.split('|')
              return { title: title || '', period: period || '', desc: desc || '' }
            })
        : [],
    skills:
      typeof skillsRaw === 'string'
        ? skillsRaw.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    contact:
      typeof prof?.contact === 'string'
        ? JSON.parse(prof.contact)
        : {},
  }

  // 4) Fetch generic page content
  const pc = await prisma.pageContent.findUnique({ where: { page } })
  const initialContent: PageContentData = {
    page,
    title: pc?.title ?? '',
    body: pc?.body ?? '',
  }

  // 5) Journey items
  const initialJourney: JourneyItem[] = await prisma.journeyItem.findMany({
    orderBy: { order: 'asc' },
  })

  // 6) Memory items
  const initialMemory: MemoryItem[] = await prisma.memoryItem.findMany({
    orderBy: { order: 'asc' },
  })

  // 7) Blog posts
  const initialBlog: BlogPost[] = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
  })

  // 8) Serialize & return
  return {
    props: {
      page,
      initialProfile: JSON.parse(JSON.stringify(initialProfile)),
      initialContent: JSON.parse(JSON.stringify(initialContent)),
      initialJourney: JSON.parse(JSON.stringify(initialJourney)),
      initialMemory: JSON.parse(JSON.stringify(initialMemory)),
      initialBlog: JSON.parse(JSON.stringify(initialBlog)),
    },
  }
}
