'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Site-wide smooth scroll. Lenis owns scroll virtualisation; ScrollTrigger is
 * told about every Lenis tick instead of listening to the native scroll event
 * itself. Do not also call ScrollTrigger.normalizeScroll() alongside this, the
 * two would fight over the same scroll position.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Pin distances are measured from layout. Photographs arriving after the
    // first paint change the page height, which leaves every pinned section
    // anchored to stale positions unless the triggers are recomputed.
    const refresh = () => ScrollTrigger.refresh()

    // By the time this effect runs, the browser's load event has often
    // already fired (React mounts after first paint, and dev-mode overhead
    // widens that gap further), so a plain listener can miss it forever.
    if (document.readyState === 'complete') refresh()
    else window.addEventListener('load', refresh)

    // Late-loading media fires no window load event once the page is already
    // loaded, so also watch the document for image decode completion.
    const images = Array.from(document.images)
    const pending = images.filter(img => !img.complete)
    let remaining = pending.length
    const onSettled = () => {
      remaining -= 1
      if (remaining <= 0) refresh()
    }
    pending.forEach(img => {
      img.addEventListener('load', onSettled, { once: true })
      img.addEventListener('error', onSettled, { once: true })
    })

    const observer = new ResizeObserver(() => refresh())
    observer.observe(document.body)

    return () => {
      window.removeEventListener('load', refresh)
      pending.forEach(img => {
        img.removeEventListener('load', onSettled)
        img.removeEventListener('error', onSettled)
      })
      observer.disconnect()
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return children
}
