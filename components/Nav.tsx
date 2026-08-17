'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ARTIST } from '@/lib/content/site'

const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

/**
 * Wall-label navigation: the artist's name and three words, nothing else.
 * Fixed and transparent so the work stays the page's subject, with a faint
 * scrim only where text would otherwise sit on a bright frame.
 */
export default function Nav() {
  const pathname = usePathname()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void/70 to-transparent" />
      <div className="relative flex items-start justify-between px-6 py-7 md:px-10">
        <Link
          href="/"
          className="pointer-events-auto label text-bone transition-opacity duration-500 hover:opacity-55"
        >
          {ARTIST}
        </Link>

        <nav className="pointer-events-auto flex gap-7 md:gap-10">
          {LINKS.map(link => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="label transition-opacity duration-500"
                style={{ opacity: active ? 1 : 0.5 }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
