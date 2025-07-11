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
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
      </header>
      <h1>{post.title}</h1>
      <img src={post.image} alt={post.title} className="w-full rounded" />
      <p>{post.excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p>
        <Link href="/blog">
          ← Back to all posts
        </Link>
      </p>
    </article>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // grab all slugs
  const posts = await prisma.PostItem.findMany({ select: { slug: true } })

  const paths = posts
    // filter out any empty‐string slugs
    .filter(({ slug }) => typeof slug === 'string' && slug.trim() !== '')
    .map(({ slug }) => ({
      params: { slug },
    }))

  return {
    paths,
    // any non‐returned slug will be server‐rendered on demand
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  if (!slug) {
    return { notFound: true }
  }

  const post = await prisma.PostItem.findUnique({
    where: { slug },
  })

  if (!post) {
    return { notFound: true }
  }

  return {
    props: {
      // serialize date
      post: {
        ...post,
        date: post.date.toISOString(),
      },
    },
  }
}
