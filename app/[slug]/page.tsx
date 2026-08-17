import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Reveal from '@/components/motion/Reveal'
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
    <article className="pb-28">
      <header className="px-6 pt-40">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-paper-faint">Galerie</p>
          <h1 className="display-lg mt-6 text-paper">{gallery.title}</h1>
          <div className="prose prose-invert-warm mt-8 max-w-2xl">
            <ReactMarkdown>{gallery.body}</ReactMarkdown>
          </div>
        </div>
      </header>

      {gallery.galleries.map(sub => (
        <section key={sub.slug} className="mx-auto mt-24 max-w-6xl px-6">
          <h2 className="eyebrow text-accent">{sub.title}</h2>
          <div className="mt-8 columns-2 gap-4 md:columns-3">
            {sub.images.map((image, i) => (
              <Reveal key={i} className="mb-4 break-inside-avoid" delay={(i % 3) * 0.06}>
                <Image
                  src={image.url}
                  alt={image.title}
                  width={image.width ?? 800}
                  height={image.height ?? 1000}
                  className="w-full object-cover"
                />
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </article>
  )
}
