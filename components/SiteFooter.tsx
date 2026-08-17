import Link from 'next/link'
import { ARTIST, CONTACT_EMAIL, SOCIALS } from '@/lib/content/site'

export default function SiteFooter() {
  return (
    <footer className="border-t border-line-soft px-6 py-16 md:px-10">
      <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <Link
          href="/contact"
          className="d-lg d-italic text-bone transition-opacity duration-700 hover:opacity-60"
        >
          Let&apos;s create something unexpected.
        </Link>

        <div className="flex flex-col gap-4 md:items-end">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="label text-bone-dim transition-colors duration-500 hover:text-bone"
          >
            {CONTACT_EMAIL}
          </a>
          <nav className="flex flex-wrap gap-5">
            {SOCIALS.map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="label-sm text-bone-faint transition-colors duration-500 hover:text-bone"
              >
                {social.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <p className="label-sm mt-16 text-bone-faint">
        {new Date().getFullYear()} {ARTIST}
      </p>
    </footer>
  )
}
