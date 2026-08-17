'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useYouTubePlayer } from '@/lib/motion/useYouTubePlayer'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

interface CinemaVideoProps {
  videoId: string
  title: string
  poster: string
  /** Load as soon as mounted rather than waiting to be scrolled to. */
  eager?: boolean
  priority?: boolean
  className?: string
}

/**
 * A film presented as a work: no player chrome, no branding, no captions.
 *
 * YouTube always draws its title over the top of the video and a gradient at
 * the bottom, and no parameter removes them. The only reliable fix is to
 * overscan: the player is rendered larger than its frame and centred, so all
 * of that chrome sits outside the visible crop. The percentages below are what
 * it takes to clear the title on a 16:9 source.
 *
 * The poster frame stays on top until the player reports ready, so the block
 * never shows a black or half-initialised iframe. If the API fails to load,
 * the poster simply remains, which is a legitimate final state.
 */
export default function CinemaVideo({
  videoId,
  title,
  poster,
  eager = false,
  priority = false,
  className,
}: CinemaVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(eager)
  const [ready, setReady] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (eager || reducedMotion) return
    const el = wrapRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          setVisible(true)
          observer.disconnect()
        })
      },
      { rootMargin: '300px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [eager, reducedMotion])

  const handleReady = useCallback(() => setReady(true), [])

  const { hostRef } = useYouTubePlayer({
    videoId,
    enabled: visible && !reducedMotion,
    onReady: handleReady,
  })

  return (
    <div ref={wrapRef} className={`relative h-full w-full overflow-hidden bg-void ${className ?? ''}`}>
      {/* Overscanned player: 128% tall, pulled up 14%, so YouTube's title and
          bottom gradient fall outside the frame entirely. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-14%] top-[-14%] h-[128%] w-[128%]"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 1.4s var(--ease-cine)' }}
      >
        <div ref={hostRef} className="h-full w-full" />
      </div>

      <Image
        src={poster}
        alt={title}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{ opacity: ready ? 0 : 1, transition: 'opacity 1.4s var(--ease-cine)' }}
      />
    </div>
  )
}
