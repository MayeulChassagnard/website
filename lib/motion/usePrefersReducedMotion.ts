'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

// SSR can't know the user's preference. Assuming false here (and letting
// useSyncExternalStore resync before paint on the client) is the standard
// fix for this, rather than a manual useEffect+useState null-first-render
// dance, which trips React's set-state-in-effect lint rule.
function getServerSnapshot() {
  return false
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
