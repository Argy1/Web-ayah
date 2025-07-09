// src/pages/blog.tsx
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar as CalendarIcon } from 'lucide-react'
import { prisma } from '../lib/prisma'
import { BlogPost } from '../types/admin'

interface Props {
  posts: BlogPost[]
}

export default function BlogIndex({ posts }: Props) {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-0">
        <h2 className="text-4xl font-extrabold text-center mb-8">📝 Blog Pribadi</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              {post.image && (
                <div className="relative w-full h-48 rounded overflow-hidden mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
              <div className="flex items-center text-gray-500 mb-4">
                <CalendarIcon size={16} className="mr-1" />
                <time>{new Date(post.date).toLocaleDateString()}</time>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.excerpt}
              </p>
              {/* ↓ Updated Link usage ↓ */}
              <Link
                href={`/blog/${post.slug}`}
                className="text-indigo-600 hover:underline"
              >
                Baca Selengkapnya →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.blogPost.findMany({
    orderBy: { date: 'desc' },
  })
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  }
}
