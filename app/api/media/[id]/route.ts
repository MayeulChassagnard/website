import { CURATED_MEDIA } from '@/lib/media/curated'
import { MEDIA_CACHE_SECONDS, RESOLVERS } from '@/lib/media/resolve'

/**
 * Streams curated media through our own origin instead of linking to the
 * external CDN directly. Some CDNs (Instagram's in particular) reject a
 * cross-origin <img>/texture load from a real browser even with an open
 * Access-Control-Allow-Origin header, same-origin sidesteps that entirely.
 *
 * Only ids from our own curated list are ever fetched, an id that isn't in
 * CURATED_MEDIA 404s rather than accepting an arbitrary URL from the
 * caller, so this can't be used as an open proxy.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const link = CURATED_MEDIA.find(item => item.id === id)
  if (!link) return new Response('Not found', { status: 404 })

  const resolved = await RESOLVERS[link.source](link.url)
  if (!resolved) return new Response('Not found', { status: 404 })

  const maxAge = MEDIA_CACHE_SECONDS[link.source]
  const upstream = await fetch(resolved.imageUrl, { next: { revalidate: maxAge } })
  if (!upstream.ok || !upstream.body) return new Response('Not found', { status: 404 })

  return new Response(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  })
}
