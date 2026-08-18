'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMounted } from '@/lib/motion/useMounted'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface MaskRevealProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  /** Tie the reveal to scroll position instead of firing once on entry. */
  scrub?: boolean
}

/**
 * Reveals a line word by word, each word climbing out of its own mask.
 *
 * Words are split in the markup rather than by GSAP so the complete sentence
 * exists for screen readers and crawlers whether or not JS runs. Gaps come from
 * an explicit margin: a trailing space inside an inline-block collapses and
 * would not render.
 */
export default function MaskReveal({ text, className, as = 'h2', scrub = false }: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const mounted = useMounted()
  const words = text.split(' ')
  const Tag = as

  useEffect(() => {
    // PhotoCorridor (and Sculpture) pin only once WebGL support is confirmed,
    // one render after everything else on the page mounts, since that answer
    // has to start false to match the server. A trigger created before that
    // render measures its position without that pin-spacer's reserved space
    // and is left short by exactly its distance: ScrollTrigger.refresh()
    // does not correct this after the fact, only creating the trigger after
    // that pin exists does. Waiting for `mounted` lines every trigger up
    // behind PhotoCorridor's in the same pass, in DOM order.
    if (reducedMotion || !mounted || !ref.current) return

    const ctx = gsap.context(() => {
      gsap.from('[data-word]', {
        yPercent: 118,
        rotate: 3,
        duration: scrub ? 1 : 1.25,
        ease: scrub ? 'none' : 'expo.out',
        stagger: scrub ? 0.06 : 0.045,
        scrollTrigger: scrub
          ? { trigger: ref.current, start: 'top 92%', end: 'top 42%', scrub: true }
          : { trigger: ref.current, start: 'top 88%', once: true },
      })
    }, ref)

    return () => ctx.revert()
  }, [reducedMotion, mounted, scrub])

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ marginRight: i < words.length - 1 ? '0.26em' : undefined }}
          >
            <span data-word className="inline-block">
              {word}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  )
}
