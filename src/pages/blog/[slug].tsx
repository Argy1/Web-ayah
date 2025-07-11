// pages/blog/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { Calendar as CalendarIcon } from 'lucide-react'
import { prisma } from '../../lib/prisma'
import { PostItem } from '../../types/admin'

interface Props {
  post: PostItem
}

export default function PostItemPage({ post }: Props) {
  return (
    <article className="prose lg:prose-xl mx-auto">
      <header className="flex items-center space-x-2">
        <CalendarIcon className="inline-block text-gray-500" />
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString()}
        </time>
      </header>

      <h1>{post.title}</h1>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded"
        />
      )}

      <p>{post.excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <p>
        <Link href="/blog">← Back to all posts</Link>
      </p>
    </article>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Ambil semua slug dari DB
  const posts = await prisma.BlogPost.findMany({
    select: { slug: true },
  })

  const paths = posts
    .filter((p) => typeof p.slug === 'string' && p.slug.trim() !== '')
    .map((p) => ({ params: { slug: p.slug } }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  if (!slug) {
    return { notFound: true }
  }

  // Ganti prisma.blogpost → prisma.blogPost
  const post = await prisma.BlogPost.findUnique({
    where: { slug },
  })

  if (!post) {
    return { notFound: true }
  }

  // Serialize date jadi string supaya Next.js bisa kirim props
  const formatted: PostItem = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date.toISOString(),
    excerpt: post.excerpt,
    content: post.content,
    image: post.image ?? '',
  }

  return {
    props: { post: formatted },
    revalidate: 60, // ISR: regenerasi tiap 60 detik
  }
}
