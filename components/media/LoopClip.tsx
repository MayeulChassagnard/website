'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { Clip } from '@/lib/content/media'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

/**
 * A short silent film, looped, presented as a work rather than as a player.
 *
 * The source is rendered square inside a wider frame with the surround left
 * black, so it is shown with object-contain: cropping it would cut into the
 * render itself. The page sits on the same black, which is what lets the
 * untouched edges disappear instead of reading as letterboxing.
 *
 * The poster stays on top until the first frame is decoded, so the block never
 * shows an empty rectangle, and it is the only thing shown when motion is
 * turned down.
 */
export default function LoopClip({ clip, priority = false }: { clip: Clip; priority?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (reducedMotion || !video) return

    // Autoplay is refused often enough (power saving, data saver, a policy the
    // browser applies before the element is in view) that the rejection has to
    // be caught, otherwise it surfaces as an unhandled rejection and the
    // poster is left as the final state without anything saying why.
    video.play().catch(() => setPlaying(false))
  }, [reducedMotion])

  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      {!reducedMotion && (
        <video
          ref={videoRef}
          src={clip.src}
          width={clip.width}
          height={clip.height}
          poster={clip.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={clip.title}
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full object-contain"
          style={{ opacity: playing ? 1 : 0, transition: 'opacity 1.4s var(--ease-cine)' }}
        />
      )}

      <Image
        src={clip.poster}
        alt={clip.title}
        fill
        priority={priority}
        sizes="100vw"
        className="object-contain"
        style={{ opacity: playing ? 0 : 1, transition: 'opacity 1.4s var(--ease-cine)' }}
      />
    </div>
  )
}
