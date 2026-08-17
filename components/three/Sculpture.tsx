'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

// three.js plus a 5.6MB model: isolated behind a dynamic import so it is only
// fetched on pages that actually show the sculpture.
const SculptureScene = dynamic(() => import('./SculptureScene'), { ssr: false })

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Mounts the WebGL sculpture only once its frame nears the viewport, and never
 * under reduced motion or without WebGL support, where a still plate stands in.
 *
 * Support is probed inside the observer callback rather than the effect body:
 * it needs `document` (so it cannot be a lazy useState initialiser during SSR)
 * and setting state directly in an effect cascades an extra render.
 */
export default function Sculpture({ caption }: { caption?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'idle' | 'ready' | 'unsupported'>('idle')
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          setStatus(hasWebGL() ? 'ready' : 'unsupported')
          observer.disconnect()
        })
      },
      // Start fetching before it is on screen; the model is large.
      { rootMargin: '400px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  const inert = reducedMotion || status === 'unsupported'

  return (
    <figure>
      <div
        ref={ref}
        data-cursor-label={inert ? undefined : 'DRAG'}
        className="relative h-svh w-full overflow-hidden bg-near"
      >
        {status === 'ready' && !reducedMotion ? (
          <SculptureScene />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="label-sm text-bone-faint">
              {inert ? 'Volume, rendu statique' : 'Volume'}
            </span>
          </div>
        )}
      </div>
      {caption && <figcaption className="label-sm mt-4 text-bone-faint">{caption}</figcaption>}
    </figure>
  )
}
