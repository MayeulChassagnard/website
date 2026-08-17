'use client'

import Image from 'next/image'
import type { Photo } from '@/lib/content/media'
import { useLightbox } from './Lightbox'

interface GalleryPhotoProps {
  photo: Photo
  photos: Photo[]
  index: number
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * A photograph hung as a print: click to view it full screen, with a slow
 * scale on hover. Rendered as a button so keyboard users reach the lightbox
 * the same way pointer users do.
 */
export default function GalleryPhoto({
  photo,
  photos,
  index,
  className,
  sizes = '(max-width: 768px) 100vw, 60vw',
  priority,
}: GalleryPhotoProps) {
  const { open } = useLightbox()

  return (
    <button
      type="button"
      onClick={() => open(photos, index)}
      data-cursor-label="VIEW"
      aria-label="Voir la photographie en plein écran"
      className={`group relative block w-full overflow-hidden ${className ?? ''}`}
    >
      <Image
        src={photo.url}
        alt=""
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.035]"
        style={{ transitionTimingFunction: 'var(--ease-cine)' }}
      />
    </button>
  )
}
