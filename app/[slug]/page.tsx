import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import {
  assertNoReservedSlugCollisions,
  getAllGallerySlugs,
  getGalleryBySlug,
} from '@/lib/contentful/queries'
import { buildMetadata, excerpt } from '@/lib/seo'

export async function generateStaticParams() {
  const slugs = await getAllGallerySlugs()
  assertNoReservedSlugCollisions(slugs)
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const gallery = await getGalleryBySlug(slug)
  if (!gallery) return {}

  return buildMetadata({
    title: gallery.title,
    description: gallery.metaDescription ?? excerpt(gallery.body),
    image: gallery.shareImage,
    path: `/${slug}`,
  })
}

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await getGalleryBySlug(slug)
  if (!gallery) notFound()

  return (
    <article className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-3xl font-semibold">{gallery.title}</h1>
      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
        <ReactMarkdown>{gallery.body}</ReactMarkdown>
      </div>

      {gallery.galleries.map(sub => (
        <section key={sub.slug} className="mt-16">
          <h2 className="text-xl font-medium">{sub.title}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {sub.images.map((image, i) => (
              <Image
                key={i}
                src={image.url}
                alt={image.title}
                width={500}
                height={500}
                className="aspect-square w-full rounded-sm object-cover"
              />
            ))}
          </div>
        </section>
      ))}
    </article>
  )
}
