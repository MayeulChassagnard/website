import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, getBlogPage } from '@/lib/contentful/queries'
import { buildMetadata, excerpt } from '@/lib/seo'
import { formatDate } from '@/lib/date'

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlogPage().catch(() => undefined)
  return buildMetadata({
    title: 'Blog',
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
    <section className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-3xl font-semibold">Blog</h1>

      {error && <p className="mt-6 text-base-600">{error}</p>}
      {!error && posts.length === 0 && <p className="mt-6 text-base-600">Aucun article pour le moment.</p>}

      <ul className="mt-12 flex flex-col gap-10">
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group flex gap-6">
              {post.heroImage && (
                <Image
                  src={post.heroImage.url}
                  alt={post.heroImage.title}
                  width={200}
                  height={130}
                  className="h-[130px] w-[200px] shrink-0 rounded-sm object-cover"
                />
              )}
              <div>
                <p className="text-sm text-base-600">{formatDate(post.publishDate)}</p>
                <h2 className="mt-1 text-xl font-medium group-hover:opacity-70">{post.title}</h2>
                <p className="mt-2 text-base-600">{excerpt(post.body, 140)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
