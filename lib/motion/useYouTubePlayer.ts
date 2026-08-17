'use client'

import { useEffect, useRef } from 'react'

interface YTPlayer {
  setPlaybackRate: (rate: number) => void
  unloadModule: (module: string) => void
  mute: () => void
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  destroy: () => void
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string
      playerVars: Record<string, string | number>
      events: {
        onReady?: (event: { target: YTPlayer }) => void
        onStateChange?: (event: { target: YTPlayer; data: number }) => void
      }
    }
  ) => YTPlayer
  PlayerState: { ENDED: number; PLAYING: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

const API_SRC = 'https://www.youtube.com/iframe_api'
let apiPromise: Promise<YTNamespace> | null = null

/** Loads the IFrame API once per page, no matter how many players mount. */
function loadApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise<YTNamespace>((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${API_SRC}"]`)
    const previousCallback = window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.()
      if (window.YT?.Player) resolve(window.YT)
      else reject(new Error('YouTube IFrame API loaded without a Player constructor'))
    }

    if (!existing) {
      const script = document.createElement('script')
      script.src = API_SRC
      script.async = true
      script.onerror = () => reject(new Error('Failed to load the YouTube IFrame API'))
      document.head.appendChild(script)
    }
  }).catch(error => {
    // Allow a later mount to retry rather than caching the failure forever.
    apiPromise = null
    throw error
  })

  return apiPromise
}

/**
 * Mounts a YouTube player through the IFrame API rather than a bare iframe.
 *
 * The API is required, not a nicety, because three things cannot be fixed with
 * URL parameters alone:
 *   - playback rate is remembered per viewer by YouTube, so a visitor who once
 *     watched anything at 2x gets this at 2x. setPlaybackRate(1) overrides it,
 *     and it is re-asserted on every play since YouTube can restore it.
 *   - captions can be force-enabled by the viewer's account settings, which
 *     cc_load_policy=0 does not always beat; unloading the module does.
 *   - looping a single video needs the playlist parameter, and even then some
 *     clients stop at the end, so ENDED is caught and restarted.
 */
export function useYouTubePlayer({
  videoId,
  enabled,
  onReady,
}: {
  videoId: string
  enabled: boolean
  onReady?: () => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)

  useEffect(() => {
    if (!enabled || !hostRef.current) return

    let cancelled = false
    let player: YTPlayer | null = null

    loadApi()
      .then(YT => {
        if (cancelled || !hostRef.current) return

        const enforce = (target: YTPlayer) => {
          target.setPlaybackRate(1)
          target.unloadModule('captions')
          target.unloadModule('cc')
        }

        player = new YT.Player(hostRef.current, {
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            fs: 0,
            playsinline: 1,
            // Annotations off, captions off. Belt and braces alongside the
            // module unload above.
            iv_load_policy: 3,
            cc_load_policy: 0,
            loop: 1,
            playlist: videoId,
          },
          events: {
            onReady: event => {
              enforce(event.target)
              event.target.mute()
              event.target.playVideo()
              onReady?.()
            },
            onStateChange: event => {
              if (event.data === YT.PlayerState.PLAYING) enforce(event.target)
              if (event.data === YT.PlayerState.ENDED) {
                event.target.seekTo(0, true)
                event.target.playVideo()
              }
            },
          },
        })

        playerRef.current = player
      })
      .catch(() => {
        // Leaving the poster frame in place is an acceptable outcome; the
        // caller never swaps it out until onReady fires.
      })

    return () => {
      cancelled = true
      try {
        player?.destroy()
      } catch {
        // Player may already be gone if the iframe was torn down first.
      }
      playerRef.current = null
    }
  }, [videoId, enabled, onReady])

  return { hostRef, playerRef }
}
