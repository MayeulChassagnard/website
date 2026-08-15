import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { href: 'https://mayeulchassagnard.pixieset.com/', label: 'Collections', external: true },
  { href: '/blog', label: 'Blog', external: false },
  { href: '/contact', label: 'Contact', external: false },
] as const

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-base/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link href="/" aria-label="Mayeul Chassagnard, accueil">
          <Image
            src="/logos/MC_logo.svg"
            alt="Mayeul Chassagnard"
            width={140}
            height={40}
            className="logo h-8 w-auto"
            priority
          />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {NAV_LINKS.map(link =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-70"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className="hover:opacity-70">
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
