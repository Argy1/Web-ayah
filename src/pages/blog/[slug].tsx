// src/pages/blog/[slug].tsx
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar as CalendarIcon } from 'lucide-react'
import { prisma } from '../../lib/prisma'
import { BlogPost } from '../../types/admin'

interface Props {
  post: BlogPost | null
}

export default function BlogPostPage({ post }: Props) {
  if (!post) {
    return (
      <div className="py-12 text-center">
        <p>Post tidak ditemukan.</p>
        {/* ↓ Updated Link usage ↓ */}
        <Link href="/blog" className="text-indigo-600 hover:underline">
          ← Kembali ke Blog
        </Link>
      </div>
    )
  }

  return (
    <article className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6 lg:px-0">
        <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-500 mb-6">
          <CalendarIcon size={16} className="mr-1" />
          <time>{new Date(post.date).toLocaleDateString()}</time>
        </div>
        {post.image && (
          <div className="relative w-full h-64 rounded overflow-hidden mb-6">
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        <div className="prose dark:prose-dark max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        {/* ↓ Updated Link usage ↓ */}
        <Link href="/blog" className="text-indigo-600 hover:underline">
          ← Kembali ke Blog
        </Link>
      </div>
    </article>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params?.slug as string
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  })
  return {
    props: {
      post: post ? JSON.parse(JSON.stringify(post)) : null,
    },
  }
}
