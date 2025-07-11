// src/pages/blog/[slug].tsx
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
      <p className="mt-8">
        <Link href="/blog">← Back to all posts</Link>
      </p>
    </article>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Ambil semua slug dari DB
  const posts = await prisma.blogPost.findMany({
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  if (!slug) {
    return { notFound: true }
  }

  const postData = await prisma.blogPost.findUnique({
    where: { slug },
  })
  if (!postData) {
    return { notFound: true }
  }

  // Serialize Date → string supaya Next.js bisa kirim props
  const formatted: PostItem = {
    id: postData.id,
    slug: postData.slug,
    title: postData.title,
    date: postData.date.toISOString(),
    excerpt: postData.excerpt,
    content: postData.content,
    image: postData.image ?? '',
  }

  return {
    props: { post: formatted },
    revalidate: 60, // ISR: regenerasi tiap 60 detik
  }
}
