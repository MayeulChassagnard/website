'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMounted } from '@/lib/motion/useMounted'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxMediaProps {
  children: React.ReactNode
  className?: string
  /** How far the inner media drifts, as a percentage of its own height. */
  strength?: number
  /** Also unmask the frame with a clip-path wipe as it enters. */
  mask?: boolean
}

/**
 * Wraps media in a fixed frame whose contents drift slower than the page,
 * creating depth. The inner element is deliberately taller than the frame so
 * the drift never exposes an empty edge.
 */
export default function ParallaxMedia({
  children,
  className,
  strength = 14,
  mask = false,
}: ParallaxMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const mounted = useMounted()

  useEffect(() => {
    // PhotoCorridor (and Sculpture) pin only once WebGL support is confirmed,
    // one render after everything else on the page mounts, since that answer
    // has to start false to match the server. A trigger created before that
    // render measures its position without that pin-spacer's reserved space
    // and is left short by exactly its distance: ScrollTrigger.refresh()
    // does not correct this after the fact, only creating the trigger after
    // that pin exists does. Waiting for `mounted` lines every trigger up
    // behind PhotoCorridor's in the same pass, in DOM order.
    if (reducedMotion || !mounted || !frameRef.current || !innerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: -strength / 2 },
        {
          yPercent: strength / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      if (mask) {
        gsap.from(frameRef.current, {
          clipPath: 'inset(18% 18% 18% 18%)',
          duration: 1.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: frameRef.current, start: 'top 85%', once: true },
        })
      }
    })

    return () => ctx.revert()
  }, [reducedMotion, mounted, strength, mask])

  return (
    <div ref={frameRef} className={`overflow-hidden ${className ?? ''}`}>
      {/* Oversized so the parallax drift always has material to reveal. */}
      <div ref={innerRef} className="relative h-[calc(100%+var(--drift))] w-full" style={{ ['--drift' as string]: `${strength}%` }}>
        {children}
      </div>
    </div>
  )
}
