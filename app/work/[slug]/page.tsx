import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProjectBlocks from '@/components/sections/ProjectBlocks'
import Reveal from '@/components/motion/Reveal'
import { PROJECTS, coverMedia, projectBySlug } from '@/lib/content/projects'

export async function generateStaticParams() {
  return PROJECTS.map(project => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) return {}

  const cover = coverMedia(project)

  return {
    title: project.title,
    description: project.concept.slice(0, 155),
    openGraph: {
      title: project.title,
      description: project.concept.slice(0, 155),
      images: cover.url ? [{ url: cover.url }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) notFound()

  const position = PROJECTS.findIndex(p => p.slug === slug)
  const next = PROJECTS[(position + 1) % PROJECTS.length]

  return (
    <article>
      {/* The first block is the project's own opening image or film, shown
          before any text, so the work introduces itself. */}
      <ProjectBlocks blocks={project.blocks.slice(0, 1)} />

      <header className="px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <h1 className="d-xl text-bone">{project.title}</h1>
        </Reveal>

        <Reveal delay={0.15}>
          <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            <div>
              <dt className="label-sm text-bone-faint">Year</dt>
              <dd className="mt-3 text-bone">{project.year}</dd>
            </div>
            <div>
              <dt className="label-sm text-bone-faint">Medium</dt>
              <dd className="mt-3 text-bone">{project.medium}</dd>
            </div>
            <div className="col-span-2">
              <dt className="label-sm text-bone-faint">Role</dt>
              <dd className="mt-3 text-bone">{project.role}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-24 grid grid-cols-12 gap-6">
            <span className="label-sm col-span-12 text-bone-faint md:col-span-3">Concept</span>
            <p className="body-copy col-span-12 md:col-span-8">{project.concept}</p>
          </div>
        </Reveal>
      </header>

      <ProjectBlocks blocks={project.blocks.slice(1)} />

      {/* Next work: keeps the visit moving through the exhibition. */}
      <section className="mt-16 border-t border-line-soft px-6 py-28 md:px-10 md:py-40">
        <span className="label-sm text-bone-faint">Next</span>
        <Reveal>
          <Link
            href={`/work/${next.slug}`}
            data-cursor-label="EXPLORE"
            className="d-xl mt-6 block text-bone transition-opacity duration-700 hover:opacity-55"
          >
            {next.title}
          </Link>
        </Reveal>
      </section>
    </article>
  )
}
