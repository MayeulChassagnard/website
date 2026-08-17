'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export interface Stat {
  value: string
  label: string
}

/**
 * Counts the numeric part of each stat up on scroll enter, preserving any
 * surrounding characters ("120+", "40k", "2015").
 *
 * The real value is rendered in the markup and only replaced once the
 * animation starts, so the correct figure is what ships in the HTML.
 */
export default function StatsRow({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDListElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return

    const ctx = gsap.context(() => {
      ref.current!.querySelectorAll<HTMLElement>('[data-stat]').forEach(el => {
        const raw = el.dataset.stat ?? ''
        const match = raw.match(/(\d[\d\s]*)/)
        if (!match) return

        const target = Number(match[1].replace(/\s/g, ''))
        const counter = { n: 0 }

        gsap.to(counter, {
          n: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = raw.replace(match[1], String(Math.round(counter.n)))
          },
        })
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <dl ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
      {stats.map(stat => (
        <div key={stat.label}>
          <dt className="display-lg tabular-nums" data-stat={stat.value}>
            {stat.value}
          </dt>
          <dd className="eyebrow mt-2 text-paper-dim">{stat.label}</dd>
        </div>
      ))}
    </dl>
  )
}
