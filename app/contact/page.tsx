import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import Reveal from '@/components/motion/Reveal'
import { CONTACT_EMAIL, SOCIALS } from '@/lib/content/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Let's create something unexpected.",
}

export default function ContactPage() {
  return (
    <section className="px-6 pt-40 pb-40 md:px-10 md:pt-56">
      <h1 className="d-hero max-w-5xl text-bone">
        Let&apos;s create something <span className="d-italic">unexpected.</span>
      </h1>

      <div className="mt-32 grid grid-cols-12 gap-y-20 gap-x-6 md:mt-48">
        <div className="col-span-12 md:col-span-5">
          <Reveal>
            <span className="label-sm text-bone-faint">Direct</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              data-cursor-label="MAIL"
              className="d-md mt-5 block text-bone transition-opacity duration-500 hover:opacity-60"
            >
              {CONTACT_EMAIL}
            </a>

            <span className="label-sm mt-16 block text-bone-faint">Elsewhere</span>
            <nav className="mt-5 flex flex-col gap-3">
              {SOCIALS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label text-bone-dim transition-colors duration-500 hover:text-bone"
                >
                  {social.label}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <Reveal delay={0.12}>
            <span className="label-sm text-bone-faint">Un projet</span>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
