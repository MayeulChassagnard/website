import type { Metadata } from 'next'
import Reveal from '@/components/motion/Reveal'
import ParallaxMedia from '@/components/motion/ParallaxMedia'
import GalleryPhoto from '@/components/media/GalleryPhoto'
import { PHOTOS } from '@/lib/content/media'
import {
  ABOUT_PARAGRAPHS,
  ARTIST,
  DISCIPLINES,
  EXHIBITIONS,
  SELECTED_CLIENTS,
} from '@/lib/content/site'

export const metadata: Metadata = {
  title: 'About',
  description: `${ARTIST}, photographe, réalisateur et artiste 3D.`,
}

export default function AboutPage() {
  const portrait = PHOTOS[7]

  return (
    <>
      <header className="px-6 pt-40 pb-24 md:px-10 md:pt-56">
        <h1 className="d-hero text-bone">About</h1>
      </header>

      <section className="grid grid-cols-12 gap-6 px-6 md:px-10">
        <div className="col-span-12 md:col-span-6">
          <ParallaxMedia className="h-[80svh] w-full" strength={14} mask>
            <GalleryPhoto
              photo={portrait}
              photos={PHOTOS}
              index={7}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="h-full"
            />
          </ParallaxMedia>
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-8 md:pt-24">
          <Reveal>
            <div className="flex flex-col gap-8">
              {ABOUT_PARAGRAPHS.map((paragraph, i) => (
                <p key={i} className="body-copy">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-40 md:px-10 md:py-56">
        <div className="grid grid-cols-12 gap-y-20 gap-x-6">
          <div className="col-span-12 md:col-span-3">
            <span className="label-sm text-bone-faint">Disciplines</span>
          </div>
          <ul className="col-span-12 flex flex-col gap-4 md:col-span-8">
            {DISCIPLINES.map(discipline => (
              <li key={discipline} className="d-md border-b border-line-soft pb-4 text-bone">
                {discipline}
              </li>
            ))}
          </ul>

          <div className="col-span-12 md:col-span-3">
            <span className="label-sm text-bone-faint">Exhibitions</span>
          </div>
          <ul className="col-span-12 flex flex-col gap-8 md:col-span-8">
            {EXHIBITIONS.map(exhibition => (
              <li key={exhibition.title} className="flex flex-col gap-1">
                <span className="label-sm text-bone-faint">{exhibition.year}</span>
                <span className="d-md text-bone">{exhibition.title}</span>
                <span className="body-copy text-sm">
                  {exhibition.venue}, {exhibition.kind}
                </span>
              </li>
            ))}
          </ul>

          <div className="col-span-12 md:col-span-3">
            <span className="label-sm text-bone-faint">Selected clients</span>
          </div>
          <ul className="col-span-12 flex flex-wrap gap-x-8 gap-y-3 md:col-span-8">
            {SELECTED_CLIENTS.map(client => (
              <li key={client} className="label-sm text-bone-dim">
                {client}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
