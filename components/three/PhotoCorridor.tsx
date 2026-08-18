'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useScrollPin } from '@/lib/motion/useScrollPin'
import { useMounted } from '@/lib/motion/useMounted'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'
import { useWebGLSupport } from '@/lib/motion/useWebGLSupport'

const PhotoCorridorScene = dynamic(() => import('./PhotoCorridorScene'), { ssr: false })

interface PhotoCorridorProps {
  images: string[]
  stillSrc: string
  /** Bottom-left wall label. */
  caption?: string
  /**
   * Optional title treatment laid over the corridor, which fades as it
   * assembles. Plain data rather than a render prop: functions cannot cross
   * the server/client boundary, and the pages composing this are server
   * components.
   */
  headline?: { title: string; subtitle?: string; cue?: string }
}

/**
 * The archive as an inhabitable space: photographs gather out of scattered
 * depth into a corridor, then the camera flies down its length.
 *
 * Pins for four viewport heights. The overlay reads a coarse, throttled copy of
 * progress from state, since it only drives DOM opacity and does not need
 * 60fps, while the WebGL scene reads the untouched ref every frame.
 */
export default function PhotoCorridor({
  images,
  stillSrc,
  caption,
  headline,
}: PhotoCorridorProps) {
  const reducedMotion = usePrefersReducedMotion()
  const supported = useWebGLSupport()
  const [coarse, setCoarse] = useState(0)

  // WebGL support is unknown for the first client render (it must match the
  // server, which always answers false), so `supported` starts false even in
  // capable browsers and flips a render later. Gating on mount rather than on
  // `supported` directly means that first render shows the same plain void
  // the canvas itself opens on, instead of the still fallback flashing in
  // just to be swapped out again a moment later.
  const mounted = useMounted()

  const active = supported && !reducedMotion
  const { ref, progress } = useScrollPin<HTMLDivElement>({ distance: 4, enabled: active })
  const rafRef = useRef(0)

  // Sample progress on a frame loop and publish only meaningful changes, so the
  // overlay updates without a render per scroll event.
  useEffect(() => {
    if (!active) return

    let last = -1
    const tick = () => {
      const next = Math.round((progress.current ?? 0) * 40) / 40
      if (next !== last) {
        last = next
        setCoarse(next)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, progress])

  // Title holds while the corridor assembles, then clears before the camera
  // starts travelling. The cue goes almost immediately.
  const titleOpacity = active ? (coarse < 0.28 ? 1 : Math.max(0, 1 - (coarse - 0.28) / 0.14)) : 1
  const cueOpacity = active ? Math.max(0, 1 - coarse / 0.1) : 1

  const overlay = (
    <div className="relative h-full w-full">
      {headline && (
        <>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ opacity: titleOpacity }}
          >
            <h1 className="d-hero text-bone">{headline.title}</h1>
            {headline.subtitle && (
              <p className="label mt-8 text-bone-dim">{headline.subtitle}</p>
            )}
          </div>

          {headline.cue && (
            <div
              className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
              style={{ opacity: cueOpacity }}
            >
              <span className="label-sm text-bone-faint">{headline.cue}</span>
              <span className="block h-10 w-px bg-gradient-to-b from-bone-faint to-transparent" />
            </div>
          )}
        </>
      )}

      {caption && (
        <span className="label-sm absolute bottom-8 left-6 text-bone-faint md:left-10">
          {caption}
        </span>
      )}
    </div>
  )

  // Neither branch below is a legitimate final state yet: `supported` cannot
  // be trusted until the client has actually resolved it.
  if (!mounted) {
    return (
      <section className="relative h-svh w-full overflow-hidden bg-void">
        <div className="absolute inset-0">{overlay}</div>
      </section>
    )
  }

  if (!active) {
    return (
      <section className="relative h-svh w-full overflow-hidden bg-void">
        <Image src={stillSrc} alt="" fill priority sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0">{overlay}</div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-svh w-full overflow-hidden bg-void">
      <PhotoCorridorScene images={images} progress={progress} />
      <div className="pointer-events-none absolute inset-0">{overlay}</div>
    </section>
  )
}
