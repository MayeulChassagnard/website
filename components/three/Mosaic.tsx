'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollProgress } from '@/lib/motion/scrollProgress'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

const MosaicScene = dynamic(() => import('./MosaicScene'), { ssr: false })

interface MosaicProps {
  images: string[]
  /** Shown instead of the canvas under reduced motion. */
  stillSrc: string
  caption?: string
}

/**
 * The archive, scattered and then recomposed. Pins for three viewport
 * heights while a single GSAP ScrollTrigger writes progress into the shared
 * store, which the WebGL scene reads each frame.
 *
 * Under reduced motion nothing pins and a still plate stands in, so the
 * section still occupies its place in the sequence without hijacking scroll.
 */
export default function Mosaic({ images, stillSrc, caption }: MosaicProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return

    const setProgress = useScrollProgress.getState().setProgress
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * 3}`,
      pin: true,
      scrub: true,
      onUpdate: self => setProgress(self.progress),
    })

    setMounted(true)

    return () => {
      trigger.kill()
      setProgress(0)
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <figure className="relative h-svh w-full overflow-hidden bg-void">
        <Image src={stillSrc} alt="" fill sizes="100vw" className="object-cover opacity-70" />
        {caption && (
          <figcaption className="label-sm absolute bottom-6 left-6 text-bone-faint">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <div ref={ref} className="relative h-svh w-full overflow-hidden bg-void">
      {mounted && <MosaicScene images={images} />}
      {caption && (
        <span className="label-sm absolute bottom-6 left-6 text-bone-faint">{caption}</span>
      )}
    </div>
  )
}
