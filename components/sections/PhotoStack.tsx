'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Photo } from '@/lib/content/media'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * A stack of prints that fans out across the frame as the section is scrolled,
 * then settles into an offset spread.
 *
 * All cards begin stacked on the same spot and are dealt outward. The
 * destinations are deterministic (derived from the index) rather than random,
 * so the composition is the same on every visit and can be judged as a layout.
 */
const SPREAD: { x: number; y: number; r: number }[] = [
  { x: -32, y: -12, r: -8 },
  { x: -12, y: 10, r: 4 },
  { x: 10, y: -14, r: -3 },
  { x: 30, y: 8, r: 7 },
  { x: -22, y: 22, r: -5 },
  { x: 22, y: 24, r: 5 },
]

export default function PhotoStack({ photos, label }: { photos: Photo[]; label?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const cards = photos.slice(0, SPREAD.length)

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.4}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      sectionRef.current!.querySelectorAll<HTMLElement>('[data-card]').forEach((card, i) => {
        const target = SPREAD[i % SPREAD.length]
        timeline.fromTo(
          card,
          { xPercent: 0, yPercent: 0, rotate: (i - cards.length / 2) * 1.6, scale: 0.82 },
          {
            xPercent: target.x * 2.4,
            yPercent: target.y * 1.5,
            rotate: target.r,
            scale: 1,
            ease: 'power2.out',
            duration: 1,
          },
          i * 0.06
        )
      })
    })

    return () => ctx.revert()
  }, [reducedMotion, cards.length])

  if (reducedMotion) {
    return (
      <section className="grid grid-cols-2 gap-4 px-6 py-24 md:grid-cols-3 md:px-10">
        {cards.map(photo => (
          <Image
            key={photo.id}
            src={photo.url}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 50vw, 33vw"
            className="h-full w-full object-cover"
          />
        ))}
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-void"
    >
      {label && (
        <span className="label-sm absolute top-1/2 left-6 -translate-y-1/2 text-bone-faint md:left-10">
          {label}
        </span>
      )}

      {cards.map((photo, i) => (
        <div
          key={photo.id}
          data-card
          className="absolute w-[38vw] max-w-[320px] will-change-transform md:w-[16vw]"
          style={{ zIndex: cards.length - i }}
        >
          <Image
            src={photo.url}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 38vw, 16vw"
            className="h-auto w-full object-cover shadow-[0_30px_80px_rgba(0,0,0,0.75)]"
          />
        </div>
      ))}
    </section>
  )
}
