import type { MediaSource } from './curated'

export interface ResolvedMedia {
  imageUrl: string
  alt: string
  source: MediaSource
}

/** YouTube's public oEmbed endpoint, keyless, works for any watch/share URL. */
export async function resolveYouTubeThumbnail(videoUrl: string): Promise<ResolvedMedia | undefined> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return undefined

    const data = (await res.json()) as { thumbnail_url?: string; title?: string }
    if (!data.thumbnail_url) return undefined

    return { imageUrl: data.thumbnail_url, alt: data.title ?? 'YouTube', source: 'youtube' }
  } catch {
    return undefined
  }
}

/** Flickr's public oEmbed endpoint, keyless, works for any public photo page URL. */
export async function resolveFlickrImage(photoUrl: string): Promise<ResolvedMedia | undefined> {
  try {
    const res = await fetch(
      `https://www.flickr.com/services/oembed/?url=${encodeURIComponent(photoUrl)}&format=json`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return undefined

    const data = (await res.json()) as { url?: string; title?: string }
    if (!data.url) return undefined

    return { imageUrl: data.url, alt: data.title ?? 'Flickr', source: 'flickr' }
  } catch {
    return undefined
  }
}

/**
 * Instagram's oEmbed now requires a Meta app + review, so there's no clean
 * official route. This uses the long-standing public convenience redirect
 * (append media/?size=l to a post URL) instead: not a documented stable
 * API, unlike the other two, but it needs no auth and works today. The
 * resolved CDN URL is signed with a short expiry, so it's re-resolved
 * often (short revalidate window) rather than cached long-term.
 */
export async function resolveInstagramImage(postUrl: string): Promise<ResolvedMedia | undefined> {
  try {
    const mediaUrl = `${postUrl.replace(/\/?$/, '/')}media/?size=l`
    const res = await fetch(mediaUrl, {
      redirect: 'follow',
      next: { revalidate: 3600 },
    })
    if (!res.ok) return undefined
    if (!res.headers.get('content-type')?.startsWith('image/')) return undefined

    return { imageUrl: res.url, alt: 'Instagram', source: 'instagram' }
  } catch {
    return undefined
  }
}

export const RESOLVERS: Record<MediaSource, (url: string) => Promise<ResolvedMedia | undefined>> = {
  youtube: resolveYouTubeThumbnail,
  flickr: resolveFlickrImage,
  instagram: resolveInstagramImage,
}

/** How long a proxied image response stays cacheable. Instagram's signed URLs expire, so it gets a much shorter window. */
export const MEDIA_CACHE_SECONDS: Record<MediaSource, number> = {
  youtube: 86400,
  flickr: 86400,
  instagram: 3600,
}
