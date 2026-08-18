'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMounted } from '@/lib/motion/useMounted'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface ScaleStageProps {
  children: React.ReactNode
  label?: string
  /** Starting width of the frame, as a viewport percentage. */
  fromWidth?: number
  fromHeight?: number
}

/**
 * Pins a section and opens the media inside it from a small framed print to
 * full bleed as the page scrolls.
 *
 * Width and height are animated rather than transform: scale, because scaling
 * a frame would stretch the media inside it. Growing the frame instead lets an
 * object-cover child re-crop as it opens, which is what makes it feel like the
 * work is expanding rather than being zoomed.
 */
export default function ScaleStage({
  children,
  label,
  fromWidth = 46,
  fromHeight = 52,
}: ScaleStageProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const mounted = useMounted()

  useEffect(() => {
    // PhotoCorridor above this section pins only once WebGL support is
    // confirmed, one render after everything else on the page mounts, since
    // that answer has to start false to match the server. A trigger created
    // before that render measures its position without that pin-spacer's
    // reserved space and is left short by exactly its distance:
    // ScrollTrigger.refresh() does not correct this after the fact, only
    // creating the trigger after that pin exists does. Waiting for `mounted`
    // lines this trigger up behind PhotoCorridor's in the same pass.
    if (reducedMotion || !mounted || !sectionRef.current || !frameRef.current) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.2}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      timeline.fromTo(
        frameRef.current,
        { width: `${fromWidth}vw`, height: `${fromHeight}vh` },
        { width: '100vw', height: '100vh', ease: 'power2.inOut', duration: 1 },
        0
      )

      if (labelRef.current) {
        // The wall label belongs to the small print; it goes as the work opens.
        timeline.to(labelRef.current, { opacity: 0, duration: 0.35, ease: 'none' }, 0)
      }
    })

    return () => ctx.revert()
  }, [reducedMotion, mounted, fromWidth, fromHeight])

  if (reducedMotion) {
    return (
      <section className="relative w-full">
        <div className="h-svh w-full">{children}</div>
        {label && <p className="label-sm mt-4 px-6 text-bone-faint md:px-10">{label}</p>}
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-void">
      <div ref={frameRef} className="relative overflow-hidden" style={{ width: `${fromWidth}vw`, height: `${fromHeight}vh` }}>
        {children}
      </div>

      {label && (
        <div ref={labelRef} className="pointer-events-none absolute bottom-10 left-6 md:left-10">
          <p className="label-sm text-bone-faint">{label}</p>
        </div>
      )}
    </section>
  )
}
