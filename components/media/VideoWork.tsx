'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

interface VideoWorkProps {
  videoId: string
  title: string
  poster: string
  caption?: string
  /** Fill the whole viewport height. */
  full?: boolean
}

/**
 * A film presented as a work rather than a media player.
 *
 * The poster frame is what loads with the page; the YouTube iframe is only
 * injected once the block is scrolled into view and the viewer chooses to
 * play. That keeps the page weight down (the brief asks for progressive
 * loading) and avoids embedding a third-party player on first paint.
 *
 * Autoplay is muted, which is the only form browsers permit without a
 * gesture, and is skipped entirely under reduced motion.
 */
export default function VideoWork({ videoId, title, poster, caption, full }: VideoWorkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  // Begins the muted ambient loop once the work is genuinely on screen. The
  // state change happens in the observer callback rather than a chained
  // effect, which would cascade an extra render.
  useEffect(() => {
    const el = containerRef.current
    if (!el || reducedMotion) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          setPlaying(true)
          observer.disconnect()
        })
      },
      { threshold: 0.35 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1`

  return (
    <figure className={full ? 'relative h-svh w-full' : 'relative aspect-video w-full'}>
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden bg-void"
        data-cursor-label={playing ? 'PAUSE' : 'PLAY'}
      >
        <Image
          src={poster}
          alt={title}
          fill
          priority={full}
          sizes="100vw"
          className="object-cover"
          style={{ opacity: playing ? 0 : 1, transition: 'opacity 1.2s var(--ease-cine)' }}
        />

        {playing && (
          <iframe
            src={src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{
              // Scale slightly to crop YouTube's letterboxing without bars.
              transform: 'scale(1.02)',
            }}
          />
        )}

        <button
          type="button"
          onClick={() => setPlaying(p => !p)}
          className="absolute inset-0 h-full w-full"
          aria-label={playing ? `Mettre en pause ${title}` : `Lire ${title}`}
        />
      </div>

      {caption && (
        <figcaption className="label-sm mt-4 text-bone-faint">{caption}</figcaption>
      )}
    </figure>
  )
}
