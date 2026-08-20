import Link from 'next/link'
import PhotoCorridor from '@/components/three/PhotoCorridor'
import CinemaVideo from '@/components/media/CinemaVideo'
import ScaleStage from '@/components/motion/ScaleStage'
import MaskReveal from '@/components/motion/MaskReveal'
import PhotoStack from '@/components/sections/PhotoStack'
import WorkIndex from '@/components/sections/WorkIndex'
import Reveal from '@/components/motion/Reveal'
import Sculpture from '@/components/three/Sculpture'
import { CORRIDOR_STILL, PHOTOS, VIDEOS, flickrSize } from '@/lib/content/media'
import { SELECTED_WORK } from '@/lib/content/projects'
import { ARTIST, DISCIPLINES, ROLES, STATEMENT } from '@/lib/content/site'

export default function HomePage() {
  // Corridor textures are capped small: thirty planes at full resolution would
  // be a pointless download for panels a few hundred pixels wide on screen.
  const corridorImages = PHOTOS.map(photo => flickrSize(photo.url, 'c'))
  const opening = VIDEOS[1]
  const featured = SELECTED_WORK

  return (
    <>
      {/* The opening: the archive gathers out of the dark, then is flown through. */}
      <PhotoCorridor
        images={corridorImages}
        stillSrc={CORRIDOR_STILL.url}
        headline={{
          title: ARTIST,
          subtitle: ROLES.join('  /  '),
          cue: 'Scroll to explore',
        }}
      />

      {/* Statement, scrubbed word by word as it is read past. */}
      <section className="px-6 py-32 md:px-10 md:py-56">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <span className="label-sm text-bone-faint">Statement</span>
          </div>
          <div className="col-span-12 md:col-span-8">
            <MaskReveal text={STATEMENT} className="d-lg text-bone" scrub />
            <Reveal delay={0.2}>
              <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
                {DISCIPLINES.map(discipline => (
                  <li key={discipline} className="label-sm text-bone-faint">
                    {discipline}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* A film, opening from a small print to the whole screen. */}
      <ScaleStage label={`${opening.title}, film`}>
        <CinemaVideo videoId={opening.id} title={opening.title} poster={opening.poster} priority />
      </ScaleStage>

      {/* Prints dealt out of a single stack. */}
      <PhotoStack photos={PHOTOS.slice(4, 10)} label="Archive" />

      {/* The sculpture, turned by the page. */}
      <Sculpture caption="Sugar, rendu temps réel WebGL" />

      <section className="pt-32 md:pt-48">
        <div className="mb-20 flex items-end justify-between px-6 md:mb-32 md:px-10">
          <MaskReveal text="Selected work" as="h2" className="d-xl text-bone" />
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
