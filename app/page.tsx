import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import AssemblyHero from '@/components/hero/AssemblyHero'
import { getHome } from '@/lib/contentful/queries'
import { getMediaPool } from '@/lib/media/pool'
import { buildMetadata, excerpt } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome().catch(() => undefined)
  if (!home) return {}

  return buildMetadata({
    title: 'Mayeul Chassagnard',
    description: excerpt(home.body),
    image: home.shareImage ?? home.heroImage,
    path: '/',
  })
}

export default async function Home() {
  let home
  let error: string | undefined

  try {
    home = await getHome()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error fetching Contentful.'
  }

  if (error) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-2xl font-semibold">Contentful not configured yet</h1>
        <p className="mt-4 text-base-600">{error}</p>
        <p className="mt-2 text-base-600">
          Set <code>CONTENTFUL_SPACE_ID</code> and <code>CONTENTFUL_DELIVERY_TOKEN</code> in
          your environment (see the Phase 0 spike in the redesign plan).
        </p>
      </section>
    )
  }

  if (!home) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-2xl font-semibold">No Home entry found</h1>
        <p className="mt-4 text-base-600">
          The fetch succeeded but returned no entries for the &quot;home&quot; content type.
          Confirm the content type API ID in Contentful matches.
        </p>
      </section>
    )
  }

  const pool = await getMediaPool()
  const images = pool.map(media => media.proxyUrl)

  return (
    <>
      <AssemblyHero
        headline={home.headline}
        fallbackImageSrc={home.heroImage?.url ?? '/share/shareIndex.png'}
        fallbackImageAlt={home.heroImage?.title ?? home.headline}
        images={images}
      />
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ReactMarkdown>{home.body}</ReactMarkdown>
        </div>
      </section>
    </>
  )
}
