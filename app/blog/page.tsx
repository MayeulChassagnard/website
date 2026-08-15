import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/contentful/queries'

export const metadata: Metadata = { title: 'Blog' }

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

      {!error && posts.length === 0 && (
        <p className="mt-6 text-base-600">No posts yet.</p>
      )}

      <ul className="mt-10 flex flex-col gap-6">
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="text-lg hover:opacity-70">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
