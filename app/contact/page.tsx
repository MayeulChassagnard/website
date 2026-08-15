import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import ContactForm from '@/components/ContactForm'
import { getAbout } from '@/lib/contentful/queries'
import { buildMetadata, excerpt } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout().catch(() => undefined)
  return buildMetadata({
    title: 'Contact',
    description: about?.body ? excerpt(about.body) : undefined,
    image: about?.shareImage,
    path: '/contact',
  })
}

export default async function ContactPage() {
  let about
  try {
    about = await getAbout()
  } catch {
    // Contentful not configured yet locally, or the "about" content type ID
    // doesn't match, the form below still works either way.
  }

  return (
    <section className="mx-auto grid max-w-4xl gap-16 px-6 py-24 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-semibold">{about?.headline ?? 'Contact'}</h1>
        {about?.body && (
          <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
            <ReactMarkdown>{about.body}</ReactMarkdown>
          </div>
        )}
      </div>
      <ContactForm />
    </section>
  )
}
