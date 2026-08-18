'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * Whether the client has taken over from the server-rendered markup.
 *
 * Exists for components that branch on a client-only answer (WebGL support,
 * viewport size) that necessarily starts false to match SSR: gating on this
 * instead of on that answer directly means the first client render shows a
 * neutral state rather than briefly committing to "unsupported" only to flip
 * a render later. Built on useSyncExternalStore, not useEffect + setState,
 * so the flip does not read as a cascading render to the lint rule (or to
 * React): getSnapshot's answer is constant, only the server/client mismatch
 * makes it appear to change once.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
