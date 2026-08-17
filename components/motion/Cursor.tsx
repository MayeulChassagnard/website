'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

/**
 * Minimal custom cursor. A small dot that grows into a labelled disc over
 * interactive media, driven by a `data-cursor-label` attribute anywhere up
 * the hovered element's ancestor chain.
 *
 * Only engages on devices with a precise pointer, and only once mounted:
 * body[data-cursor="on"] is what hides the native cursor (see globals.css),
 * so if this component never runs the native cursor is untouched. Disabled
 * entirely under reduced motion.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.body.dataset.cursor = 'on'

    // Position is written straight to the transform each frame rather than
    // through React state: re-rendering on mousemove would be far too costly.
    let raf = 0
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const current = { ...target }

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      setVisible(true)

      const el = (e.target as HTMLElement | null)?.closest?.('[data-cursor-label]')
      setLabel(el ? (el as HTMLElement).dataset.cursorLabel ?? null : null)
    }

    const onLeave = () => setVisible(false)

    const tick = () => {
      // Slight easing so the cursor trails the pointer instead of snapping.
      current.x += (target.x - current.x) * 0.18
      current.y += (target.y - current.y) * 0.18
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      delete document.body.dataset.cursor
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[200] hidden items-center justify-center rounded-full border border-bone/70 text-bone transition-[width,height,background-color,opacity] duration-500 [@media(pointer:fine)]:flex"
      style={{
        width: label ? 84 : 9,
        height: label ? 84 : 9,
        backgroundColor: label ? 'rgba(237,233,227,0.06)' : 'var(--color-bone)',
        backdropFilter: label ? 'blur(2px)' : undefined,
        opacity: visible ? 1 : 0,
        transitionTimingFunction: 'var(--ease-cine)',
      }}
    >
      <span className="label-sm select-none" style={{ opacity: label ? 1 : 0 }}>
        {label}
      </span>
    </div>
  )
}
