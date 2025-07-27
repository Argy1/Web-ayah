// src/pages/blog/index.tsx
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { Calendar as CalendarIcon } from 'lucide-react'
import { PostItem } from '../../types/admin'

interface Props {
  posts: PostItem[]
}

export default function BlogIndex({ posts }: Props) {
  return (
    <main className="prose lg:prose-xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`}>
                  <a className="hover:underline">{post.title}</a>
                </Link>
              </h2>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <CalendarIcon className="inline-block mr-1" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>
              <p className="text-gray-700">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { prisma } = await import('../../lib/prisma')
  // Ambil semua post, urutkan terbaru dulu
  const rawPosts = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
  })

  const posts: PostItem[] = rawPosts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.date.toISOString(),
    excerpt: p.excerpt,
    image: p.image ?? '',
    content: p.content,
  }))

  return {
    props: { posts },
    revalidate: 60,
  }
}
