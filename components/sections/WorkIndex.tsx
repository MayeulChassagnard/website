import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'
import ParallaxMedia from '@/components/motion/ParallaxMedia'
import { coverMedia, type Project } from '@/lib/content/projects'

/**
 * Asymmetric editorial index. Each project declares its own format, and the
 * column span, offset and height come from that rather than from a uniform
 * grid, so no two rows read the same way.
 */
const FORMAT_CLASS: Record<Project['format'], string> = {
  hero: 'md:col-span-12 md:h-[88svh]',
  wide: 'md:col-span-8 md:col-start-5 md:h-[62svh]',
  tall: 'md:col-span-5 md:h-[96svh]',
  square: 'md:col-span-4 md:col-start-3 md:h-[46svh]',
}

function WorkEntry({ project, index }: { project: Project; index: number }) {
  const cover = coverMedia(project)

  return (
    <Reveal className={`col-span-12 ${FORMAT_CLASS[project.format]}`} delay={0.05}>
      <Link
        href={`/work/${project.slug}`}
        data-cursor-label="EXPLORE"
        className="group block h-full"
      >
        <ParallaxMedia className="relative h-[58svh] w-full md:h-full" strength={12}>
          <Image
            src={cover.url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            priority={index < 2}
            className="object-cover transition-[transform,filter] duration-[1600ms] group-hover:scale-[1.04]"
            style={{ transitionTimingFunction: 'var(--ease-cine)' }}
          />
          <div className="absolute inset-0 bg-void/25 opacity-0 transition-opacity duration-1000 group-hover:opacity-100" />
        </ParallaxMedia>

        {/* Wall label. Always present, so nothing is hover-only. */}
        <div className="mt-5 flex items-baseline justify-between gap-6">
          <div>
            <h3 className="d-md text-bone">{project.title}</h3>
            <p className="body-copy mt-2 max-w-md text-sm opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
              {project.concept.split('.')[0]}.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="label-sm block text-bone-faint">{project.medium}</span>
            <span className="label-sm mt-1 block text-bone-faint">{project.year}</span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

export default function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-28 px-6 md:gap-y-40 md:px-10">
      {projects.map((project, i) => (
        <WorkEntry key={project.slug} project={project} index={i} />
      ))}
    </div>
  )
}
