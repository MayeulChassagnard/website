import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { getHome } from '@/lib/contentful/queries'

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

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      {home.heroImage && (
        <Image
          src={`${home.heroImage.url}?w=1600&q=70&fm=webp`}
          alt={home.heroImage.title}
          width={home.heroImage.width ?? 1600}
          height={home.heroImage.height ?? 900}
          className="mb-10 w-full rounded-sm object-cover"
          priority
        />
      )}
      <h1 className="text-3xl font-semibold">{home.headline}</h1>
      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
        <ReactMarkdown>{home.body}</ReactMarkdown>
      </div>
    </section>
  )
}
