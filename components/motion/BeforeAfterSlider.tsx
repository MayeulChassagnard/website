'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMounted } from '@/lib/motion/useMounted'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  /** Frame ratio, width / height. Both plates are shown in the same frame. */
  aspect: number
  beforeLabel?: string
  afterLabel?: string
  /**
   * CSS filter applied to the "before" layer. Lets the same photograph act
   * as its own before/after, which is what a grading comparison actually
   * is: two different photographs would demonstrate nothing.
   */
  beforeFilter?: string
  caption?: string
  priority?: boolean
}

/** Portion of the frame, from the left, showing the finished image. */
const clipAfter = (pct: number) => `inset(0 ${100 - pct}% 0 0)`

/**
 * Before and after in one frame, wiped open by the page.
 *
 * The section is pinned and the wipe is driven by scroll rather than left to
 * a handle nobody drags: the point of a montage is watching the finished
 * image arrive over the state it came from, and that has to happen on its
 * own. Touching the frame hands the wipe over for good, so the comparison can
 * still be worked back and forth by hand.
 *
 * Every value is written straight to the DOM. A wipe that re-rendered React
 * on each scroll tick and each pointer move would cost far more than the four
 * style writes it actually needs.
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  aspect,
  beforeLabel = 'Avant',
  afterLabel = 'Après',
  beforeFilter,
  caption,
  priority,
}: BeforeAfterSliderProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const afterRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLButtonElement>(null)
  const beforeLabelRef = useRef<HTMLDivElement>(null)
  const afterLabelRef = useRef<HTMLDivElement>(null)

  const position = useRef(0)
  const takenOver = useRef(false)

  const reducedMotion = usePrefersReducedMotion()
  const mounted = useMounted()

  // Scrubbed, the wipe starts closed, because scrolling is what opens it.
  // Static, it starts halfway, since nothing will ever move it. Reading the
  // preference during render rather than from an effect puts the right value
  // in the markup itself, so there is no first frame to correct.
  const initial = reducedMotion ? 50 : 0

  const apply = useCallback((pct: number) => {
    const value = Math.min(100, Math.max(0, pct))
    position.current = value

    if (afterRef.current) afterRef.current.style.clipPath = clipAfter(value)
    if (lineRef.current) lineRef.current.style.left = `${value}%`
    if (handleRef.current) {
      handleRef.current.style.left = `${value}%`
      handleRef.current.setAttribute('aria-valuenow', String(Math.round(value)))
    }

    // Each wall label belongs to the plate on its side, so it goes with it.
    if (afterLabelRef.current) afterLabelRef.current.style.opacity = value > 16 ? '1' : '0'
    if (beforeLabelRef.current) beforeLabelRef.current.style.opacity = value < 84 ? '1' : '0'
  }, [])

  const takeOver = useCallback(
    (clientX: number) => {
      const frame = frameRef.current
      if (!frame) return
      takenOver.current = true
      const rect = frame.getBoundingClientRect()
      apply(((clientX - rect.left) / rect.width) * 100)
    },
    [apply]
  )

  useEffect(() => {
    // Waiting for `mounted` lines this trigger up behind PhotoCorridor's and
    // Sculpture's, which pin only once WebGL support is confirmed, one render
    // after everything else. A trigger created before those pin-spacers exist
    // measures its position without their reserved space and is left short by
    // exactly their distance, which ScrollTrigger.refresh() does not correct
    // after the fact.
    if (reducedMotion || !mounted || !sectionRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.7}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: self => {
          if (takenOver.current) return
          // Hold on the source for a beat, then land on the finished image
          // before the section is released rather than at the exact moment it
          // starts moving again.
          apply(((self.progress - 0.12) / 0.66) * 100)
        },
      })
    })

    return () => ctx.revert()
  }, [reducedMotion, mounted, apply])

  const frame = (
    <div
      ref={frameRef}
      data-cursor-label="DRAG"
      onPointerDown={e => {
        e.currentTarget.setPointerCapture(e.pointerId)
        takeOver(e.clientX)
      }}
      onPointerMove={e => {
        if (e.buttons !== 1) return
        takeOver(e.clientX)
      }}
      className="relative touch-none overflow-hidden select-none"
      style={{ aspectRatio: aspect, width: `min(92vw, calc(78svh * ${aspect}))` }}
    >
      <Image
        src={beforeSrc}
        alt={beforeLabel}
        fill
        sizes="(max-width: 768px) 92vw, 60vw"
        priority={priority}
        className="object-cover"
        style={{ filter: beforeFilter }}
        draggable={false}
      />

      <div ref={afterRef} className="absolute inset-0" style={{ clipPath: clipAfter(initial) }}>
        <Image
          src={afterSrc}
          alt={afterLabel}
          fill
          sizes="(max-width: 768px) 92vw, 60vw"
          priority={priority}
          className="object-cover"
          draggable={false}
        />
      </div>

      <div
        ref={afterLabelRef}
        className="label-sm pointer-events-none absolute top-5 left-5 bg-void/60 px-3 py-2 text-bone transition-opacity duration-700"
        style={{ opacity: initial > 16 ? 1 : 0 }}
      >
        {afterLabel}
      </div>
      <div
        ref={beforeLabelRef}
        className="label-sm pointer-events-none absolute top-5 right-5 bg-void/60 px-3 py-2 text-bone transition-opacity duration-700"
        style={{ opacity: initial < 84 ? 1 : 0 }}
      >
        {beforeLabel}
      </div>

      <div ref={lineRef} className="absolute inset-y-0 w-px bg-bone" style={{ left: `${initial}%` }} />
      <button
        ref={handleRef}
        type="button"
        role="slider"
        aria-label="Comparaison avant/après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={initial}
        onKeyDown={e => {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
          e.preventDefault()
          takenOver.current = true
          apply(position.current + (e.key === 'ArrowLeft' ? -5 : 5))
        }}
        className="absolute top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-void/20 bg-bone shadow-2xl focus:outline-2 focus:outline-offset-2 focus:outline-bone"
        style={{ left: `${initial}%` }}
      />
    </div>
  )

  if (reducedMotion) {
    return (
      <section className="flex flex-col items-center px-6 py-28 md:px-10 md:py-40">
        {frame}
        {caption && <p className="label-sm mt-5 self-start text-bone-faint">{caption}</p>}
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-void"
    >
      {frame}
      {caption && (
        <p className="label-sm pointer-events-none absolute bottom-10 left-6 text-bone-faint md:left-10">
          {caption}
        </p>
      )}
    </section>
  )
}
