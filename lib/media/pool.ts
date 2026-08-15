import { cache } from 'react'
import { FLICKR_PHOTO_URLS, INSTAGRAM_POST_URLS, YOUTUBE_VIDEO_URLS } from './curated'
import { resolveFlickrImage, resolveInstagramImage, resolveYouTubeThumbnail, type ResolvedMedia } from './resolve'

/**
 * Resolves every curated link in parallel and drops whatever failed
 * (removed post, network hiccup, expired link) instead of failing the
 * whole page. Meant for decorative use (hero texture pool), never content
 * a visitor is specifically looking for.
 */
export const getMediaPool = cache(async (): Promise<ResolvedMedia[]> => {
  const results = await Promise.allSettled([
    ...YOUTUBE_VIDEO_URLS.map(resolveYouTubeThumbnail),
    ...FLICKR_PHOTO_URLS.map(resolveFlickrImage),
    ...INSTAGRAM_POST_URLS.map(resolveInstagramImage),
  ])

  return results
    .filter((r): r is PromiseFulfilledResult<ResolvedMedia | undefined> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((media): media is ResolvedMedia => Boolean(media))
})
