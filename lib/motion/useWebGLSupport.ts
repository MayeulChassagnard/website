'use client'

import { useSyncExternalStore } from 'react'

// Probing creates a canvas and a context, so the answer is cached: it cannot
// change during a session, and getSnapshot must be cheap and return a stable
// value or React will loop.
let cached: boolean | null = null

function getSnapshot(): boolean {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    cached = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    cached = false
  }
  return cached
}

// Support never changes, so there is nothing to subscribe to.
const subscribe = () => () => {}

/**
 * Whether WebGL is available.
 *
 * Uses useSyncExternalStore rather than useEffect + useState: the probe needs
 * `document`, so it cannot run during SSR, and assigning the result with
 * setState inside an effect cascades an extra render on every 3D section.
 * The server snapshot is false, so the still fallback is what gets prerendered
 * and the canvas only appears once the client has confirmed support.
 */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
