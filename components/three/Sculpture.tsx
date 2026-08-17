'use client'

import dynamic from 'next/dynamic'
import { useScrollPin } from '@/lib/motion/useScrollPin'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'
import { useWebGLSupport } from '@/lib/motion/useWebGLSupport'

// three.js plus a 5.6MB model: dynamic-imported so it is only fetched on pages
// that actually show the sculpture.
const SculptureScene = dynamic(() => import('./SculptureScene'), { ssr: false })

/**
 * Pins the sculpture and hands its scroll progress to the scene, so the object
 * is turned and approached by the page rather than looping on its own.
 *
 * Never mounts under reduced motion or without WebGL, where a still plate
 * stands in and the section does not pin.
 */
export default function Sculpture({ caption }: { caption?: string }) {
  const reducedMotion = usePrefersReducedMotion()
  const supported = useWebGLSupport()

  const active = supported && !reducedMotion
  const { ref, progress } = useScrollPin<HTMLDivElement>({ distance: 3, enabled: active })

  if (!active) {
    return (
      <figure>
        <div className="flex h-svh w-full items-center justify-center bg-near">
          <span className="label-sm text-bone-faint">Volume, rendu statique</span>
        </div>
        {caption && (
          <figcaption className="label-sm mt-4 px-6 text-bone-faint md:px-10">{caption}</figcaption>
        )}
      </figure>
    )
  }

  return (
    <div ref={ref} className="relative h-svh w-full overflow-hidden bg-near" data-cursor-label="DRAG">
      <SculptureScene progress={progress} />
      {caption && (
        <span className="label-sm absolute bottom-8 left-6 text-bone-faint md:left-10">{caption}</span>
      )}
    </div>
  )
}
