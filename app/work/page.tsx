import type { Metadata } from 'next'
import WorkIndex from '@/components/sections/WorkIndex'
import { PROJECTS } from '@/lib/content/projects'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Photographie, film, 3D, direction artistique et expérimentations visuelles.',
}

const MEDIA_ORDER = ['PHOTOGRAPHY', 'FILM', '3D / CGI', 'EXPERIMENTAL', 'ART DIRECTION'] as const

export default function WorkPage() {
  return (
    <>
      <header className="px-6 pt-40 pb-24 md:px-10 md:pt-56 md:pb-32">
        <h1 className="d-hero text-bone">Work</h1>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
          {MEDIA_ORDER.map(medium => (
            <li key={medium} className="label-sm text-bone-faint">
              {medium}
            </li>
          ))}
        </ul>
      </header>

      <WorkIndex projects={PROJECTS} />

      <div className="h-40 md:h-56" />
    </>
  )
}
