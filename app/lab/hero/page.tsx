import type { Metadata } from 'next'
import AssemblyHero from '@/components/hero/AssemblyHero'
import BeforeAfterSlider from '@/components/motion/BeforeAfterSlider'

export const metadata: Metadata = {
  title: 'Hero prototype',
  robots: { index: false, follow: false },
}

/**
 * Throwaway route to validate the Phase 3 animation mechanics (R3F + GSAP
 * ScrollTrigger + Lenis pin/scrub, reduced-motion fallback, before/after
 * slider) in isolation before wiring anything into the real home page.
 * Not linked from navigation. Delete once the choreography is approved and
 * merged into app/page.tsx.
 */
export default function HeroLabPage() {
  return (
    <div>
      <AssemblyHero
        headline="Mayeul Chassagnard"
        fallbackImageSrc="/share/shareIndex.png"
        fallbackImageAlt="Mayeul Chassagnard"
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
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-2xl font-semibold">Prototype : slider avant/après</h2>
        <p className="mt-4 text-base-600">
          Composant autonome, sans GSAP ni R3F. Images de démonstration ci-dessous,
          à remplacer par un vrai avant/après une fois le contenu prêt.
        </p>
        <div className="mt-8">
          <BeforeAfterSlider beforeSrc="/share/shareIndex.png" afterSrc="/share/shareBlog.jpg" />
        </div>
      </section>
    </div>
  )
}
