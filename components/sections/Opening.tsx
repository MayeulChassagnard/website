'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ARTIST, ROLES } from '@/lib/content/site'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

interface OpeningProps {
  videoId: string
  poster: string
  title: string
}

/**
 * The opening work: a film held at full viewport with the artist's name and
 * disciplines laid over it as quietly as possible.
 *
 * The poster frame is the LCP image and loads with priority; the player is
 * only injected after mount so the first paint is a single optimised still
 * rather than a third-party iframe. Both the overlay and the scroll cue fade
 * out as the page starts moving, so the work is left alone.
 */
export default function Opening({ videoId, poster, title }: OpeningProps) {
  const [playing, setPlaying] = useState(false)
  const [faded, setFaded] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    // Give the poster a beat to paint before the player mounts behind it.
    const t = window.setTimeout(() => setPlaying(true), 900)
    return () => window.clearTimeout(t)
  }, [reducedMotion])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setFaded(Math.min(1, y / (window.innerHeight * 0.5)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`

  return (
    <section ref={ref} className="relative h-svh w-full overflow-hidden bg-void">
      <Image
        src={poster}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ opacity: playing ? 0 : 0.9, transition: 'opacity 2s var(--ease-cine)' }}
      />

      {playing && (
        <iframe
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ transform: 'scale(1.03)' }}
        />
      )}

      {/* Scrim: keeps the overlay legible without flattening the image. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/50 via-transparent to-void/80" />

      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: 1 - faded, transition: 'opacity 300ms linear' }}
      >
        <h1 className="d-hero text-bone">{ARTIST}</h1>
        <p className="label mt-8 text-bone-dim">{ROLES.join('  /  ')}</p>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
        style={{ opacity: 1 - faded, transition: 'opacity 300ms linear' }}
      >
        <span className="label-sm text-bone-faint">Scroll to explore</span>
        <span className="block h-10 w-px bg-gradient-to-b from-bone-faint to-transparent" />
      </div>

      <span className="label-sm absolute bottom-8 left-6 hidden text-bone-faint md:block">
        {title}
      </span>
    </section>
  )
}
