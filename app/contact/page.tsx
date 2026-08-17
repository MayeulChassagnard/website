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
    // Contentful not configured, or the "about" content type ID doesn't
    // match, the form below still works either way.
  }

  return (
    <section className="px-6 pt-40 pb-28">
      <div className="mx-auto grid max-w-5xl gap-20 md:grid-cols-2">
        <div>
          <p className="eyebrow text-paper-faint">Contact</p>
          <h1 className="display-lg mt-6 text-paper">
            {about?.headline ?? 'Parlons de votre projet'}
          </h1>
          {about?.body && (
            <div className="prose prose-invert-warm mt-8 max-w-none">
              <ReactMarkdown>{about.body}</ReactMarkdown>
            </div>
          )}
          <a
            href="mailto:hello@mayeulchassagnard.com"
            className="eyebrow mt-10 inline-block text-accent transition-opacity hover:opacity-70"
          >
            hello@mayeulchassagnard.com
          </a>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
