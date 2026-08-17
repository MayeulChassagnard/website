import type { Metadata } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import AssemblyHero from '@/components/hero/AssemblyHero'
import Marquee from '@/components/motion/Marquee'
import Reveal from '@/components/motion/Reveal'
import SplitReveal from '@/components/motion/SplitReveal'
import BeforeAfterSlider from '@/components/motion/BeforeAfterSlider'
import HorizontalShowcase from '@/components/sections/HorizontalShowcase'
import ProjectList from '@/components/sections/ProjectList'
import StatsRow from '@/components/sections/StatsRow'
import { getHome, getImageAssets } from '@/lib/contentful/queries'
import { getMediaPool } from '@/lib/media/pool'
import { buildMetadata, excerpt } from '@/lib/seo'
import {
  DEMO_INTRO,
  DEMO_TAGLINE,
  DISCIPLINES,
  PROCESS,
  PROJECTS,
  SERVICES,
  SHOWCASE_IMAGE_TITLES,
  STATS,
  TESTIMONIALS,
} from '@/lib/demo/content'

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome().catch(() => undefined)
  if (!home) return {}

  return buildMetadata({
    title: 'Mayeul Chassagnard, photographe et vidéaste',
    description: excerpt(home.body),
    image: home.shareImage ?? home.heroImage,
    path: '/',
  })
}

export default async function Home() {
  const [home, assets, pool] = await Promise.all([
    getHome().catch(() => undefined),
    getImageAssets().catch(() => []),
    getMediaPool().catch(() => []),
  ])

  // Prefer Mayeul's own photographs over the leftover starter assets, then
  // top up with whatever else exists so the sections never look sparse.
  const byTitle = new Map(assets.map(asset => [asset.title, asset]))
  const curated = SHOWCASE_IMAGE_TITLES.map(title => byTitle.get(title)).filter(
    (asset): asset is NonNullable<typeof asset> => Boolean(asset)
  )
  const showcase = curated.length > 0 ? curated : assets.slice(0, 10)

  // Hero textures: curated social media plus the Contentful library, capped
  // small on the Contentful side since 18 planes at full resolution would be
  // a pointless download for images rendered a few hundred pixels wide.
  const heroImages = [
    ...pool.map(media => media.proxyUrl),
    ...showcase.map(asset => `${asset.url}?w=640&fm=webp&q=70`),
  ]

  const projects = PROJECTS.map(project => ({
    ...project,
    imageUrl: byTitle.get(project.imageTitle)?.url,
  }))

  // One photograph acting as its own before/after: a grading comparison
  // between two different images would demonstrate nothing.
  const gradingSample = byTitle.get('MistyMountain') ?? showcase[0]

  return (
    <>
      <AssemblyHero
        headline={home?.headline ?? 'Mayeul Chassagnard'}
        fallbackImageSrc={home?.heroImage?.url ?? '/share/shareIndex.png'}
        fallbackImageAlt={home?.heroImage?.title ?? 'Mayeul Chassagnard'}
        images={heroImages}
      />

      {/* Intro */}
      <section className="px-6 py-28 md:py-40">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-accent">{DEMO_TAGLINE}</p>
          <SplitReveal
            text={DEMO_INTRO}
            as="h2"
            className="display-lg mt-8 max-w-4xl text-paper"
          />
          {home?.body && (
            <Reveal delay={0.15}>
              <div className="prose prose-invert-warm mt-10 max-w-2xl text-lg">
                <ReactMarkdown>{home.body}</ReactMarkdown>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <Marquee items={DISCIPLINES} />

      {/* Pinned horizontal image track */}
      {showcase.length > 0 && (
        <section>
          <div className="px-6 pt-28 md:pt-40">
            <div className="mx-auto max-w-5xl">
              <p className="eyebrow text-paper-faint">Sélection</p>
              <SplitReveal text="Un aperçu du travail" className="display-lg mt-6 text-paper" />
            </div>
          </div>
          <HorizontalShowcase
            images={showcase.map(asset => ({
              url: asset.url,
              title: asset.title,
              width: asset.width,
              height: asset.height,
            }))}
          />
        </section>
      )}

      {/* Services */}
      <section className="px-6 py-28 md:py-40">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-paper-faint">Ce que je fais</p>
          <SplitReveal text="Quatre métiers, un seul regard" className="display-lg mt-6 text-paper" />

          <div className="mt-20 grid gap-x-12 gap-y-16 md:grid-cols-2">
            {SERVICES.map((service, i) => (
              <Reveal key={service.index} delay={i * 0.08}>
                <article className="border-t border-line pt-6">
                  <span className="eyebrow text-accent">{service.index}</span>
                  <h3 className="display-md mt-4 text-paper">{service.title}</h3>
                  <p className="mt-4 text-paper-dim">{service.body}</p>
                  <ul className="mt-6 flex flex-col gap-2">
                    {service.bullets.map(bullet => (
                      <li key={bullet} className="text-sm text-paper-faint">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects index with cursor-trailing preview */}
      <section className="py-28 md:py-40">
        <div className="px-6">
          <div className="mx-auto mb-16 max-w-5xl">
            <p className="eyebrow text-paper-faint">Projets</p>
            <SplitReveal text="Archive sélective" className="display-lg mt-6 text-paper" />
          </div>
        </div>
        <ProjectList projects={projects} />
      </section>

      {/* Before / after */}
      {gradingSample && (
        <section className="px-6 py-28 md:py-40">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow text-paper-faint">Post-production</p>
            <SplitReveal
              text="L'étalonnage change tout"
              className="display-lg mt-6 text-paper"
            />
            <p className="mt-6 max-w-xl text-paper-dim">
              Glissez pour comparer. À gauche le fichier brut sorti du boîtier, à droite
              l&apos;image étalonnée.
            </p>
            <Reveal className="mt-12">
              <BeforeAfterSlider
                beforeSrc={gradingSample.url}
                afterSrc={gradingSample.url}
                beforeFilter="saturate(0.45) contrast(0.82) brightness(1.08)"
                beforeLabel="Brut"
                afterLabel="Étalonné"
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="px-6 py-28 md:py-40">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-paper-faint">Méthode</p>
          <SplitReveal text="Comment ça se passe" className="display-lg mt-6 text-paper" />

          <ol className="mt-20 grid gap-12 md:grid-cols-4">
            {PROCESS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <li className="border-t border-line pt-6">
                  <span className="eyebrow text-accent">{step.step}</span>
                  <h3 className="mt-4 font-display text-2xl text-paper">{step.title}</h3>
                  <p className="mt-3 text-sm text-paper-dim">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <StatsRow stats={STATS} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-28 md:py-40">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.author} delay={i * 0.1}>
              <figure>
                <blockquote className="font-display text-2xl leading-snug text-paper">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block text-sm text-paper">{testimonial.author}</span>
                  <span className="eyebrow mt-1 block text-paper-faint">{testimonial.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 pb-40">
        <div className="mx-auto max-w-5xl border-t border-line pt-20">
          <SplitReveal
            text="Un projet, une date, une idée floue ?"
            className="display-xl text-paper"
          />
          <Reveal delay={0.2}>
            <Link
              href="/contact"
              className="eyebrow mt-12 inline-block border border-paper-faint px-8 py-4 text-paper transition-colors hover:border-accent hover:text-accent"
            >
              Me contacter
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
