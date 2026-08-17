import Link from 'next/link'

const SOCIAL_LINKS = [
  { href: 'https://www.flickr.com/photos/mayeulchassagnard/', label: 'Flickr' },
  { href: 'https://instagram.com/mayeulchassagnard', label: 'Instagram' },
  { href: 'https://www.youtube.com/@mayeulchassagnard', label: 'YouTube' },
] as const

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink">
      <div className="px-6 py-20">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-paper-faint">Une image en tête ?</p>
            <Link
              href="/contact"
              className="display-lg mt-4 block text-paper transition-colors hover:text-accent"
            >
              Parlons-en
            </Link>
          </div>

          <nav className="flex flex-col gap-3 md:items-end">
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="eyebrow text-paper-dim transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="eyebrow mt-20 text-paper-faint">
          Copyright {new Date().getFullYear()} Mayeul Chassagnard
        </p>
      </div>
    </footer>
  )
}
