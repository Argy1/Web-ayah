// src/pages/blog.tsx
import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { prisma } from '../lib/prisma'
import { PostItem } from '../types/admin'
import { Calendar as CalendarIcon } from 'lucide-react'

interface Props {
  posts: PostItem[]
}

const BlogPage: NextPage<Props> = ({ posts }) => {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Blog</h1>
      {posts.map(post => (
        <article key={post.slug} className="space-y-2">
          <h2 className="text-2xl font-semibold">
            <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <CalendarIcon size={16} />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString()}
            </time>
          </div>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Ganti prisma.post => prisma.blogPost
  const rawPosts = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
  })

  // Serialize Date ke ISO string
  const posts: PostItem[] = rawPosts.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.date.toISOString(),
    excerpt: p.excerpt,
    content: p.content,
    image: p.image ?? '',
  }))

  return {
    props: { posts },
    revalidate: 60, // reload data tiap 60 detik
  }
}

export default BlogPage
