'use client'

import { useEffect, useRef } from 'react'

/**
 * Route-change entrance. A template (not a layout) remounts on every
 * navigation, which is what lets each page fade and settle in rather than
 * snapping into place.
 *
 * The animation is written directly on the element and cleared afterwards, so
 * a page is never left holding an opacity/transform if something interrupts.
 * Reduced motion skips it entirely.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    window.scrollTo(0, 0)

    el.style.opacity = '0'
    el.style.transform = 'translateY(14px)'

    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 1100ms var(--ease-cine), transform 1100ms var(--ease-cine)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })

    const done = window.setTimeout(() => {
      el.style.transition = ''
      el.style.transform = ''
      el.style.opacity = ''
    }, 1300)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(done)
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
