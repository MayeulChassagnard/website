'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}

/**
 * Slow, restrained fade-and-lift on scroll enter.
 *
 * Uses gsap.from() rather than a CSS-hidden initial state so that if JS
 * never runs, or motion is reduced, the content is simply already visible
 * instead of stranded at opacity 0.
 */
export default function Reveal({ children, className, delay = 0, y = 34 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 1.5,
        delay,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
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
