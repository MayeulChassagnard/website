'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface SplitRevealProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'p'
}

/**
 * Rises a headline into view word by word, each word masked by its own
 * overflow-hidden wrapper so it appears to climb out of the baseline.
 *
 * Words are split in markup (not with GSAP's SplitText) so the full text is
 * present and readable for screen readers and crawlers regardless of JS.
 * Word gaps come from an explicit margin, a trailing space inside an
 * inline-block collapses and would not render reliably.
 */
export default function SplitReveal({ text, className, as = 'h2' }: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const words = text.split(' ')
  const Tag = as

  useEffect(() => {
    if (reducedMotion || !ref.current) return

    const ctx = gsap.context(() => {
      gsap.from('[data-word]', {
        yPercent: 115,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.055,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    }, ref)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ marginRight: i < words.length - 1 ? '0.25em' : undefined }}
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
