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
    <article className="pb-28">
      <header className="px-6 pt-40">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow text-paper-faint">
            {formatDate(post.publishDate)} · {readingTime(post.body)} min de lecture
          </span>
          <h1 className="display-lg mt-6 text-paper">{post.title}</h1>
        </div>
      </header>

      {post.heroImage && (
        <div className="mx-auto mt-16 max-w-5xl px-6">
          <Image
            src={post.heroImage.url}
            alt={post.heroImage.title}
            width={post.heroImage.width ?? 1600}
            height={post.heroImage.height ?? 900}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      <div className="px-6">
        <div className="prose prose-invert-warm mx-auto mt-16 max-w-3xl text-lg">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      </div>

      {(previous || next) && (
        <nav className="mx-auto mt-28 flex max-w-3xl justify-between gap-8 border-t border-line px-6 pt-10">
          {previous ? (
            <Link href={`/blog/${previous.slug}`} className="group max-w-[45%]">
              <span className="eyebrow text-paper-faint">Précédent</span>
              <span className="mt-2 block font-display text-xl text-paper transition-colors group-hover:text-accent">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/blog/${next.slug}`} className="group max-w-[45%] text-right">
              <span className="eyebrow text-paper-faint">Suivant</span>
              <span className="mt-2 block font-display text-xl text-paper transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  )
}
