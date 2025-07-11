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
      {post.image && <img src={post.image} alt={post.title} className="w-full rounded" />}
      <p>{post.excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p className="mt-6">
        <Link href="/blog">← Back to all posts</Link>
      </p>
    </article>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.blogPost.findMany({
    select: { slug: true },
  })
  const paths = posts.map((p) => ({ params: { slug: p.slug } }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  if (!slug) return { notFound: true }

  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return { notFound: true }

  const formatted: PostItem = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date.toISOString(),
    excerpt: post.excerpt,
    content: post.content,
    image: post.image ?? '',
  }

  return { props: { post: formatted }, revalidate: 60 }
}
