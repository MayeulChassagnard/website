'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { Photo } from '@/lib/content/media'

interface LightboxState {
  open: (photos: Photo[], index: number) => void
}

const LightboxContext = createContext<LightboxState>({ open: () => {} })

export const useLightbox = () => useContext(LightboxContext)

/**
 * Full-screen photograph viewer.
 *
 * Kept in a provider so any photo anywhere in the tree can open it without
 * every gallery owning its own copy of the overlay. Escape closes, arrows
 * step through, and body scroll is locked while open.
 */
export default function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [index, setIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback((next: Photo[], at: number) => {
    setPhotos(next)
    setIndex(at)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const step = useCallback(
    (delta: number) => setIndex(i => (i + delta + photos.length) % photos.length),
    [photos.length]
  )

  useEffect(() => {
    if (!isOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }

    // Lenis reads body overflow, so locking here also stops the smooth
    // scroller from moving the page behind the overlay.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close, step])

  const value = useMemo(() => ({ open }), [open])
  const current = photos[index]

  return (
    <LightboxContext.Provider value={value}>
      {children}

      <div
        aria-hidden={!isOpen}
        className="fixed inset-0 z-[150] bg-void"
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 700ms var(--ease-cine), visibility 700ms',
        }}
      >
        {isOpen && current && (
          <div className="relative flex h-full w-full flex-col">
            <div className="flex items-center justify-between px-6 py-6">
              <span className="label-sm text-bone-faint">
                {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
              </span>
              <button type="button" onClick={close} className="label-sm text-bone-dim hover:text-bone">
                Fermer
              </button>
            </div>

            <div className="relative flex-1 px-6 pb-6">
              <Image
                key={current.id}
                src={current.url}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {photos.length > 1 && (
              <div className="flex items-center justify-center gap-10 pb-8">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="label-sm text-bone-dim hover:text-bone"
                >
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="label-sm text-bone-dim hover:text-bone"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </LightboxContext.Provider>
  )
}
