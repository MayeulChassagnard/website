/**
 * Custom next/image loader targeting Contentful's Images API directly
 * instead of Next's built-in image-optimization server. Contentful already
 * resizes/re-encodes on its own CDN, so proxying through Next's optimizer
 * on top would just be a redundant second resize.
 */
export default function contentfulImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const url = new URL(src)
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality ?? 75).toString())
  url.searchParams.set('fm', 'webp')
  return url.toString()
}
