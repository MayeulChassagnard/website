'use client'

import { useCallback, useRef, useState } from 'react'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
  /**
   * CSS filter applied to the "before" layer. Lets the same photograph act
   * as its own before/after, which is what a grading comparison actually
   * is: two different photographs would demonstrate nothing.
   */
  beforeFilter?: string
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Avant',
  afterLabel = 'Après',
  beforeFilter,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return
    updateFromClientX(e.clientX)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPosition(p => Math.max(0, p - 5))
    if (e.key === 'ArrowRight') setPosition(p => Math.min(100, p + 5))
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-4/3 w-full touch-none overflow-hidden rounded-sm select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeSrc}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)`, filter: beforeFilter }}
        draggable={false}
      />

      <div className="eyebrow pointer-events-none absolute top-4 left-4 bg-ink/70 px-3 py-1.5 text-paper">
        {beforeLabel}
      </div>
      <div className="eyebrow pointer-events-none absolute top-4 right-4 bg-ink/70 px-3 py-1.5 text-paper">
        {afterLabel}
      </div>

      <div className="absolute inset-y-0 w-px bg-paper" style={{ left: `${position}%` }} />
      <button
        type="button"
        role="slider"
        aria-label="Comparaison avant/après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/20 bg-paper shadow-2xl focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        style={{ left: `${position}%` }}
      />
    </div>
  )
}
