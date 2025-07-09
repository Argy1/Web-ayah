// src/pages/blog/[slug].tsx
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '../../lib/prisma'
import { PostItem } from '../../types/admin'
import { Calendar as CalendarIcon } from 'lucide-react'

interface Props {
  post: PostItem | null
}

const PostPage: NextPage<Props> = ({ post }) => {
  if (!post) {
    return <div className="p-8 text-center">Maaf, postingan tidak ditemukan.</div>
  }

  return (
    <article className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="flex items-center text-sm text-gray-500 space-x-2">
        <CalendarIcon size={16} />
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString()}
        </time>
      </div>

      {post.image && (
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}

      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <p>
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← Kembali ke Daftar Blog
        </Link>
      </p>
    </article>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await prisma.blogPost.findMany({ select: { slug: true } })
  const paths = all.map(({ slug }) => ({ params: { slug } }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  const raw = await prisma.blogPost.findUnique({ where: { slug } })

  if (!raw) {
    return { notFound: true }
  }

  const post: PostItem = {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    date: raw.date.toISOString(),
    excerpt: raw.excerpt,
    content: raw.content,
    image: raw.image ?? '',
  }

  return {
    props: { post },
    revalidate: 60,
  }
}

export default PostPage
