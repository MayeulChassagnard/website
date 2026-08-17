import Link from 'next/link'
import Opening from '@/components/sections/Opening'
import WorkIndex from '@/components/sections/WorkIndex'
import Reveal from '@/components/motion/Reveal'
import { PROJECTS } from '@/lib/content/projects'
import { VIDEOS } from '@/lib/content/media'
import { DISCIPLINES, STATEMENT } from '@/lib/content/site'

export default function HomePage() {
  const opening = VIDEOS[1] // Lapland: the coldest, quietest frame of the set
  const featured = PROJECTS.slice(0, 4)

  return (
    <>
      <Opening videoId={opening.id} poster={opening.poster} title={opening.title} />

      {/* Statement. Held in a lot of empty space on purpose. */}
      <section className="px-6 py-32 md:px-10 md:py-56">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <span className="label-sm text-bone-faint">Statement</span>
          </div>
          <Reveal className="col-span-12 md:col-span-8">
            <p className="d-lg text-bone">{STATEMENT}</p>
            <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
              {DISCIPLINES.map(discipline => (
                <li key={discipline} className="label-sm text-bone-faint">
                  {discipline}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <div className="rule mx-6 md:mx-10" />

      <section className="pt-28 md:pt-40">
        <div className="mb-20 flex items-end justify-between px-6 md:mb-32 md:px-10">
          <h2 className="d-xl text-bone">
            Selected <span className="d-italic">work</span>
          </h2>
          <Link
            href="/work"
            className="label-sm shrink-0 text-bone-dim transition-colors duration-500 hover:text-bone"
          >
            Tout voir
          </Link>
        </div>

        <WorkIndex projects={featured} />
      </section>

      <section className="px-6 py-40 md:px-10 md:py-56">
        <Reveal>
          <Link
            href="/work"
            data-cursor-label="EXPLORE"
            className="d-xl block text-bone transition-opacity duration-700 hover:opacity-55"
          >
            Voir l&apos;ensemble
          </Link>
        </Reveal>
      </section>
    </>
  )
}
