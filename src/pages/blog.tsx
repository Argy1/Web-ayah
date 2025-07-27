// src/pages/blog.tsx
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { PostItem } from '../types/admin'
import { Calendar as CalendarIcon } from 'lucide-react'

interface Props {
  posts: PostItem[]
}

export default function BlogList({ posts }: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {posts.map((post) => (
        <article key={post.slug} className="border-b pb-4">
          <header className="flex items-center space-x-2">
            <CalendarIcon className="text-gray-500" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString()}
            </time>
          </header>
          <h2 className="text-xl font-semibold">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { prisma } = await import('../lib/prisma')
  const raw = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
  })

  const posts: PostItem[] = raw.map((p) => ({
    ...p,
    date: p.date.toISOString(),
  }))

  return {
    props: { posts },
  }
}
