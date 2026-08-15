import type { Metadata } from 'next'
import type { ResolvedAsset } from './contentful/client'

export const SITE_URL = 'https://mayeulchassagnard.com'
export const SITE_NAME = 'Mayeul Chassagnard'

/** Markdown -> plain text, truncated. Good enough for meta descriptions / OG. */
export function excerpt(markdown: string, length = 160): string {
  const plain = markdown
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#*_`>~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > length ? `${plain.slice(0, length).trimEnd()}…` : plain
}

export function buildMetadata({
  title,
  description,
  image,
  path,
}: {
  title: string
  description?: string
  image?: ResolvedAsset
  path: string
}): Metadata {
  const url = `${SITE_URL}${path}`
  const images = image ? [{ url: image.url, width: image.width, height: image.height }] : undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image.url] : undefined,
    },
  }
}
