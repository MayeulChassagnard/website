export type MediaSource = 'youtube' | 'flickr' | 'instagram'

export interface CuratedLink {
  id: string
  source: MediaSource
  url: string
}

/**
 * Curated source links for the hero's media pool. Each entry is a normal,
 * shareable page URL (not an embed/iframe URL), resolved server-side (see
 * lib/media/resolve.ts) and served through /api/media/[id] rather than
 * linked to directly. Some CDNs (Instagram's in particular) reject
 * cross-origin image loads from a real browser even with an open CORS
 * header, so every image goes through our own origin instead.
 *
 * Add more links any time, the pool degrades gracefully: a broken or
 * removed link is just skipped, not a build failure.
 */
export const CURATED_MEDIA: CuratedLink[] = [
  { id: 'ig-1', source: 'instagram', url: 'https://www.instagram.com/p/CFEPZpnnDpT/' },
  // { id: 'yt-1', source: 'youtube', url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX' },
  // { id: 'fl-1', source: 'flickr', url: 'https://www.flickr.com/photos/mayeulchassagnard/XXXXXXXXXXX/' },
]
