'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  const words = text.split(' ')
  const Tag = as

  useEffect(() => {
    if (reducedMotion || !ref.current) return

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
  }, [reducedMotion, scrub])

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
