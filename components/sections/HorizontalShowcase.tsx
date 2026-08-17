'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export interface ShowcaseImage {
  url: string
  title: string
  width?: number
  height?: number
}

/**
 * Pins the section and translates a wide image track sideways as the user
 * scrolls vertically. Track distance is measured from real layout, so it
 * adapts to however many images are passed in.
 *
 * Under reduced motion the same images fall back to a normal, natively
 * swipeable overflow-x strip: no pin, no scroll hijacking.
 */
export default function HorizontalShowcase({ images }: { images: ShowcaseImage[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const distance = () => track.scrollWidth - window.innerWidth

      // Skip pinning entirely if the track already fits, otherwise the
      // section would pin for no visible movement.
      if (distance() <= 0) return

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <section className="py-24">
        <div className="flex gap-4 overflow-x-auto px-6 pb-4">
          {images.map((image, i) => (
            <Image
              key={i}
              src={image.url}
              alt={image.title}
              width={image.width ?? 800}
              height={image.height ?? 1000}
              className="h-[60vh] w-auto shrink-0 object-cover"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div ref={trackRef} className="flex h-full items-center gap-4 pl-6 will-change-transform">
        {images.map((image, i) => (
          <figure key={i} className="relative shrink-0">
            <Image
              src={image.url}
              alt={image.title}
              width={image.width ?? 800}
              height={image.height ?? 1000}
              className="h-[68vh] w-auto max-w-none object-cover"
            />
            <figcaption className="eyebrow mt-3 text-paper-faint">{image.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
