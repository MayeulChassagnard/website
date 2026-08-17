import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { href: 'https://mayeulchassagnard.pixieset.com/', label: 'Collections', external: true },
  { href: '/blog', label: 'Journal', external: false },
  { href: '/contact', label: 'Contact', external: false },
] as const

const linkClass = 'eyebrow text-paper transition-opacity hover:opacity-60'

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-ink/80 to-transparent">
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/" aria-label="Mayeul Chassagnard, accueil">
          <Image
            src="/logos/MC_logo.svg"
            alt="Mayeul Chassagnard"
            width={140}
            height={40}
            className="h-7 w-auto invert"
            unoptimized
            priority
          />
        </Link>
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map(link =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
