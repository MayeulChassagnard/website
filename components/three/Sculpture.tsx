'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useScrollPin } from '@/lib/motion/useScrollPin'
import { useMounted } from '@/lib/motion/useMounted'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'
import { useWebGLSupport } from '@/lib/motion/useWebGLSupport'

// three.js plus a 5.6MB model: dynamic-imported so it is only fetched on pages
// that actually show the sculpture.
const SculptureScene = dynamic(() => import('./SculptureScene'), { ssr: false })

// Thresholds mirror the crossfades in SculptureScene.
const STAGES = [
  { at: 0, label: 'Wireframe' },
  { at: 0.3, label: 'Shading' },
  { at: 0.5, label: 'Lighting' },
  { at: 0.8, label: 'Render' },
] as const

/**
 * Pins the sculpture and hands its scroll progress to the scene, so the model
 * is built up rather than merely displayed: wireframe, then shaded clay, then
 * the lit render.
 *
 * Never mounts under reduced motion or without WebGL, where a still plate
 * stands in and the section does not pin.
 */
export default function Sculpture({ caption }: { caption?: string }) {
  const reducedMotion = usePrefersReducedMotion()
  const supported = useWebGLSupport()
  const [stage, setStage] = useState(0)

  // WebGL support is unknown for the first client render (it must match the
  // server, which always answers false), so `supported` starts false even in
  // capable browsers and flips a render later. Gating the pin on mount rather
  // than on `supported` directly avoids briefly rendering (and pinning) the
  // static fallback in capable browsers, which otherwise flashes in and also
  // has this section's ScrollTrigger pin measured a render late, throwing off
  // the sections around it.
  const mounted = useMounted()

  const active = supported && !reducedMotion
  const { ref, progress } = useScrollPin<HTMLDivElement>({ distance: 4, enabled: active })
  const rafRef = useRef(0)

  // Sample the progress ref on a frame loop and publish only when the stage
  // actually changes, so the readout never causes a render per scroll tick.
  useEffect(() => {
    if (!active) return

    let last = -1
    const tick = () => {
      const p = progress.current ?? 0
      let next = 0
      for (let i = 0; i < STAGES.length; i++) if (p >= STAGES[i].at) next = i
      if (next !== last) {
        last = next
        setStage(next)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, progress])

  // Neither branch below is a legitimate final state yet: `supported` cannot
  // be trusted until the client has actually resolved it.
  if (!mounted) {
    return <div className="h-svh w-full bg-near" />
  }

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

      {/* Process readout: names the stage currently on screen. */}
      <div className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 md:left-10">
        <ol className="flex flex-col gap-2">
          {STAGES.map((item, i) => (
            <li
              key={item.label}
              className="label-sm transition-colors duration-700"
              style={{ color: i === stage ? 'var(--color-bone)' : 'var(--color-bone-faint)' }}
            >
              {String(i + 1).padStart(2, '0')} {item.label}
            </li>
          ))}
        </ol>
      </div>

      {caption && (
        <span className="label-sm absolute bottom-8 left-6 text-bone-faint md:left-10">{caption}</span>
      )}
    </div>
  )
}
