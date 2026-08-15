import { cache } from 'react'
import { CURATED_MEDIA, type MediaSource } from './curated'
import { RESOLVERS } from './resolve'

export interface PoolItem {
  id: string
  proxyUrl: string
  alt: string
  source: MediaSource
}

/**
 * Resolves every curated link in parallel and drops whatever failed
 * (removed post, network hiccup, expired link) instead of failing the
 * whole page. The image URL handed to the client is always our own
 * /api/media/[id] proxy, never the raw external CDN URL, see that route
 * for why.
 */
export const getMediaPool = cache(async (): Promise<PoolItem[]> => {
  const results = await Promise.allSettled(
    CURATED_MEDIA.map(async (link): Promise<PoolItem | undefined> => {
      const resolved = await RESOLVERS[link.source](link.url)
      if (!resolved) return undefined
      return { id: link.id, proxyUrl: `/api/media/${link.id}`, alt: resolved.alt, source: link.source }
    })
  )

  return results
    .filter((r): r is PromiseFulfilledResult<PoolItem | undefined> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((item): item is PoolItem => Boolean(item))
})
