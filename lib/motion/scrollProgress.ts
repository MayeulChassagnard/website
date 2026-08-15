import { create } from 'zustand'

/**
 * Single source of truth for the hero's scroll position (0 to 1), written by
 * the GSAP ScrollTrigger driving the pin, read by the R3F scene's useFrame
 * loop. Keeping GSAP and R3F's separate RAF loops decoupled through this
 * store (instead of GSAP tweening Three.js objects directly) avoids the two
 * loops fighting over the same objects.
 */
interface ScrollProgressState {
  progress: number
  setProgress: (progress: number) => void
}

export const useScrollProgress = create<ScrollProgressState>(set => ({
  progress: 0,
  setProgress: progress => set({ progress }),
}))
