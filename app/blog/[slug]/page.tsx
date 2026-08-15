import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { getAllPosts, getPostBySlug } from '@/lib/contentful/queries'
import { buildMetadata, excerpt } from '@/lib/seo'
import { formatDate } from '@/lib/date'
import { readingTime } from '@/lib/readingTime'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const result = await getPostBySlug(slug)
  if (!result) return {}

  return buildMetadata({
    title: result.post.title,
    description: excerpt(result.post.body),
    image: result.post.heroImage,
    path: `/blog/${slug}`,
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await getPostBySlug(slug)
  if (!result) notFound()

  const { post, previous, next } = result

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="mt-3 text-sm text-base-600">
        {formatDate(post.publishDate)} · {readingTime(post.body)} min de lecture
      </p>

      {post.heroImage && (
        <Image
          src={post.heroImage.url}
          alt={post.heroImage.title}
          width={post.heroImage.width ?? 1600}
          height={post.heroImage.height ?? 900}
          className="mt-10 w-full rounded-sm object-cover"
          priority
        />
      )}

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>

      {(previous || next) && (
        <nav className="mt-16 flex justify-between border-t border-base-300/30 pt-8 text-sm">
          {previous ? (
            <Link href={`/blog/${previous.slug}`} className="hover:opacity-70">
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/blog/${next.slug}`} className="text-right hover:opacity-70">
              {next.title} →
            </Link>
          )}
        </nav>
      )}
    </article>
  )
}
