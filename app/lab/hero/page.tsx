import type { Metadata } from 'next'
import AssemblyHero from '@/components/hero/AssemblyHero'
import BeforeAfterSlider from '@/components/motion/BeforeAfterSlider'
import { getMediaPool } from '@/lib/media/pool'

export const metadata: Metadata = {
  title: 'Hero prototype',
  robots: { index: false, follow: false },
}

/**
 * Throwaway route to validate the Phase 3 animation mechanics (R3F + GSAP
 * ScrollTrigger + Lenis pin/scrub, reduced-motion fallback, before/after
 * slider, live YouTube/Flickr/Instagram media pool) in isolation before
 * wiring anything into the real home page. Not linked from navigation.
 * Delete once the choreography is approved and merged into app/page.tsx.
 */
export default async function HeroLabPage() {
  const pool = await getMediaPool()
  const images = pool.map(media => media.imageUrl)

  return (
    <div>
      <AssemblyHero
        headline="Mayeul Chassagnard"
        fallbackImageSrc="/share/shareIndex.png"
        fallbackImageAlt="Mayeul Chassagnard"
        images={images}
      />

      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-2xl font-semibold">Prototype : assemblage 3D au scroll</h2>
        <p className="mt-4 text-base-600">
          Scène R3F pinnée par GSAP ScrollTrigger, propulsée par Lenis. Les 18 pièces
          partent de positions dispersées puis s&apos;assemblent en grille sur les premiers
          40% du scroll, puis la caméra avance à travers la grille sur les 60% restants.
          Recharge cette page avec &quot;Réduire les animations&quot; activé dans les
          préférences système pour voir le repli statique.
        </p>
        <p className="mt-4 text-base-600">
          {images.length > 0
            ? `${images.length} image(s) chargée(s) depuis YouTube/Flickr/Instagram (voir lib/media/curated.ts).`
            : 'Aucun lien renseigné pour le moment dans lib/media/curated.ts, la grille retombe sur des couleurs unies.'}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-2xl font-semibold">Prototype : slider avant/après</h2>
        <p className="mt-4 text-base-600">
          Composant autonome, sans GSAP ni R3F. Images de démonstration ci-dessous,
          à remplacer par un vrai avant/après une fois le contenu prêt.
        </p>
        <div className="mt-8">
          <BeforeAfterSlider
            beforeSrc={images[0] ?? '/share/shareIndex.png'}
            afterSrc={images[1] ?? '/share/shareBlog.jpg'}
          />
        </div>
      </section>
    </div>
  )
}
