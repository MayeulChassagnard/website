'use client'

import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface UseScrollPinOptions {
  /** Pin length as a multiple of viewport height. */
  distance?: number
  enabled?: boolean
  start?: string
}

/**
 * Pins a section and reports its scroll progress through a ref.
 *
 * Progress is written to a ref rather than React state on purpose: these
 * drive per-frame WebGL and transform work, so a re-render per scroll tick
 * would be ruinous. A ref also makes each pinned section independent, which a
 * single shared store could not do once more than one 3D scene exists on a
 * page.
 */
export function useScrollPin<T extends HTMLElement>({
  distance = 3,
  enabled = true,
  start = 'top top',
}: UseScrollPinOptions = {}): {
  ref: RefObject<T | null>
  progress: RefObject<number>
} {
  const ref = useRef<T>(null)
  const progress = useRef(0)

  useEffect(() => {
    if (!enabled || !ref.current) return

    // gsap.context + revert, not ScrollTrigger.kill().
    //
    // pin: true wraps the element in a generated pin-spacer. kill() leaves
    // that spacer in the DOM, so React's double-invoked effects in
    // development stack a second one, which duplicates the section visually
    // and corrupts the scroll distance of every pinned section below it.
    // revert() unwinds the spacer as well as the trigger.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start,
        end: () => `+=${window.innerHeight * distance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: self => {
          progress.current = self.progress
        },
      })
    })

    return () => {
      ctx.revert()
      progress.current = 0
    }
  }, [enabled, distance, start])

  return { ref, progress }
}
