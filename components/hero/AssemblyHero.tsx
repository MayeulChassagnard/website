'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollProgress } from '@/lib/motion/scrollProgress'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

interface AssemblyHeroProps {
  headline: string
  fallbackImageSrc: string
  fallbackImageAlt: string
  images: string[]
}

function HeroOverlay({ headline }: { headline: string }) {
  const progress = useScrollProgress(state => state.progress)
  const opacity = progress < 0.15 ? 1 : Math.max(0, 1 - (progress - 0.15) / 0.15)

  return (
    <div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ opacity }}
    >
      <h1 className="display-xl text-paper">{headline}</h1>
      <p className="eyebrow mt-8 text-paper-dim">Scroll pour explorer</p>
    </div>
  )
}

export default function AssemblyHero({
  headline,
  fallbackImageSrc,
  fallbackImageAlt,
  images,
}: AssemblyHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || !heroRef.current) return

    const setProgress = useScrollProgress.getState().setProgress
    const trigger = ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * 3}`,
      pin: true,
      scrub: true,
      onUpdate: self => setProgress(self.progress),
    })

    return () => {
      trigger.kill()
      setProgress(0)
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-ink">
        <Image
          src={fallbackImageSrc}
          alt={fallbackImageAlt}
          fill
          priority
          unoptimized={fallbackImageSrc.startsWith('/')}
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/40 px-6 text-center">
          <h1 className="display-xl text-paper">{headline}</h1>
        </div>
      </div>
    )
  }

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden bg-ink">
      <HeroCanvas images={images} />
      <HeroOverlay headline={headline} />
    </div>
  )
}
