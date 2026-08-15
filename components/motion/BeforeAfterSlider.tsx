'use client'

import { useCallback, useRef, useState } from 'react'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Avant',
  afterLabel = 'Après',
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
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        draggable={false}
      />

      <div className="pointer-events-none absolute top-4 left-4 rounded-sm bg-secondary/70 px-2 py-1 text-xs text-base">
        {beforeLabel}
      </div>
      <div className="pointer-events-none absolute top-4 right-4 rounded-sm bg-secondary/70 px-2 py-1 text-xs text-base">
        {afterLabel}
      </div>

      <div className="absolute inset-y-0 w-px bg-base" style={{ left: `${position}%` }} />
      <button
        type="button"
        role="slider"
        aria-label="Comparaison avant/après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/20 bg-base shadow-[var(--shadow)] focus:outline-2 focus:outline-offset-2 focus:outline-secondary"
        style={{ left: `${position}%` }}
      />
    </div>
  )
}
