'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Seconds of delay before this element animates in. */
  delay?: number
  /** Distance in px the element rises from. */
  y?: number
}

/**
 * Fades and lifts its children into view once, on scroll enter.
 *
 * Uses gsap.from() rather than CSS-hidden initial state on purpose: the
 * start state is applied at runtime, so if JS never runs (or motion is
 * reduced) the content is simply already visible instead of stuck at
 * opacity 0.
 */
export default function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    })

    return () => ctx.revert()
  }, [reducedMotion, delay, y])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
