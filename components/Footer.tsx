const SOCIAL_LINKS = [
  { href: 'https://www.flickr.com/photos/mayeulchassagnard/', label: 'Flickr' },
  { href: 'https://instagram.com/mayeulchassagnard', label: 'Instagram' },
  { href: 'https://www.youtube.com/@mayeulchassagnard', label: 'YouTube' },
] as const

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-base-300/30">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm">
        <p>Copyright © {new Date().getFullYear()} Mayeul Chassagnard</p>
        <nav className="flex gap-4">
          {SOCIAL_LINKS.map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="hover:opacity-70">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
