import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'
import { getAllPosts, getBlogPage } from '@/lib/contentful/queries'
import { buildMetadata, excerpt } from '@/lib/seo'
import { formatDate } from '@/lib/date'

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlogPage().catch(() => undefined)
  return buildMetadata({
    title: 'Journal',
    description: blog?.body ? excerpt(blog.body) : undefined,
    image: blog?.shareImage,
    path: '/blog',
  })
}

export default async function BlogIndex() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = []
  let error: string | undefined

  try {
    posts = await getAllPosts()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error fetching Contentful.'
  }

  return (
    <section className="px-6 pt-40 pb-28">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-paper-faint">Journal</p>
        <h1 className="display-lg mt-6 text-paper">Notes et carnets</h1>

        {error && <p className="mt-10 text-paper-dim">{error}</p>}
        {!error && posts.length === 0 && (
          <p className="mt-10 text-paper-dim">Aucun article pour le moment.</p>
        )}

        <ul className="mt-20 border-t border-line">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Reveal delay={i * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-6 border-b border-line py-8 sm:flex-row sm:items-center"
                >
                  {post.heroImage && (
                    <Image
                      src={post.heroImage.url}
                      alt={post.heroImage.title}
                      width={220}
                      height={150}
                      className="h-[150px] w-full shrink-0 object-cover grayscale transition-all duration-500 group-hover:grayscale-0 sm:w-[220px]"
                    />
                  )}
                  <div>
                    <span className="eyebrow text-paper-faint">
                      {formatDate(post.publishDate)}
                    </span>
                    <h2 className="display-md mt-2 text-paper transition-transform duration-300 group-hover:translate-x-2">
                      {post.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm text-paper-dim">
                      {excerpt(post.body, 150)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
