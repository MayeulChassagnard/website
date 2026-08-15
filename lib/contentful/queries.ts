import { cache } from 'react'
import {
  fetchEntries,
  resolveAsset,
  resolveAssetList,
  resolveEntryList,
  type CdaResponse,
} from './client'
import type { About, BlogPage, ExtendedGallery, Home, Post, SubGallery, Tag } from './types'

/**
 * Content type API IDs, inferred from the old Gatsby GraphQL type names
 * (ContentfulHome -> "home", ContentfulExtendedGallery -> "extendedGallery",
 * etc). Gatsby's schema-generation convention is reliable but not proof —
 * confirm these against Settings -> Content model in the real space before
 * relying on this in Phase 1 (see plan Phase 0).
 */
const CONTENT_TYPE = {
  home: 'home',
  blog: 'blog',
  post: 'post',
  extendedGallery: 'extendedGallery',
  subGallery: 'subGallery',
  about: 'about',
} as const

function resolveTags(link: unknown, includes?: CdaResponse['includes']): Tag[] {
  return resolveEntryList<{ title: string; slug: string }>(link, includes).map(entry => ({
    title: entry.fields.title,
    slug: entry.fields.slug,
  }))
}

export async function getHome(): Promise<Home | undefined> {
  const res = await fetchEntries<{
    headline: string
    body: string
    heroImage?: unknown
    shareImage?: unknown
    youtubeLink?: string
    instagramLink?: string
    flickrLink?: string
    flickrStaticImg?: string
  }>(CONTENT_TYPE.home, { include: '1' })

  const entry = res.items[0]
  if (!entry) return undefined

  return {
    headline: entry.fields.headline,
    body: entry.fields.body,
    heroImage: resolveAsset(entry.fields.heroImage, res.includes),
    shareImage: resolveAsset(entry.fields.shareImage, res.includes),
    youtubeLink: entry.fields.youtubeLink,
    instagramLink: entry.fields.instagramLink,
    flickrLink: entry.fields.flickrLink,
    flickrStaticImg: entry.fields.flickrStaticImg,
  }
}

export async function getBlogPage(): Promise<BlogPage | undefined> {
  const res = await fetchEntries<{
    title: string
    heroImage?: unknown
    shareImage?: unknown
    body: string
  }>(CONTENT_TYPE.blog, { include: '1' })

  const entry = res.items[0]
  if (!entry) return undefined

  return {
    title: entry.fields.title,
    heroImage: resolveAsset(entry.fields.heroImage, res.includes),
    shareImage: resolveAsset(entry.fields.shareImage, res.includes),
    body: entry.fields.body,
  }
}

/** Wrapped in React's cache() so generateStaticParams and page render share one fetch. */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  const res = await fetchEntries<{
    title: string
    slug: string
    publishDate: string
    tags?: unknown
    heroImage?: unknown
    body: string
  }>(CONTENT_TYPE.post, {
    include: '1',
    order: '-fields.publishDate',
    limit: '1000',
  })

  return res.items.map(entry => ({
    title: entry.fields.title,
    slug: entry.fields.slug,
    publishDate: entry.fields.publishDate,
    tags: resolveTags(entry.fields.tags, res.includes),
    heroImage: resolveAsset(entry.fields.heroImage, res.includes),
    body: entry.fields.body,
  }))
})

export interface PostWithNeighbors {
  post: Post
  previous?: Post
  next?: Post
}

/** Replaces gatsby-node.js's build-time pageContext injection: derive prev/next from the sorted list. */
export async function getPostBySlug(slug: string): Promise<PostWithNeighbors | undefined> {
  const posts = await getAllPosts()
  const index = posts.findIndex(post => post.slug === slug)
  if (index === -1) return undefined

  return {
    post: posts[index],
    previous: index > 0 ? posts[index - 1] : undefined,
    next: index < posts.length - 1 ? posts[index + 1] : undefined,
  }
}

export const getAllGallerySlugs = cache(async (): Promise<string[]> => {
  const res = await fetchEntries<{ slug: string }>(CONTENT_TYPE.extendedGallery, {
    select: 'fields.slug',
    limit: '1000',
  })
  return res.items.map(entry => entry.fields.slug)
})

export async function getGalleryBySlug(slug: string): Promise<ExtendedGallery | undefined> {
  const res = await fetchEntries<{
    title: string
    slug: string
    metaDescription?: string
    publishDate: string
    tags?: unknown
    shareImage?: unknown
    body: string
    galleries?: unknown
  }>(CONTENT_TYPE.extendedGallery, {
    'fields.slug': slug,
    include: '3',
    limit: '1',
  })

  const entry = res.items[0]
  if (!entry) return undefined

  const subGalleries = resolveEntryList<{
    slug: string
    title: string
    images?: unknown
  }>(entry.fields.galleries, res.includes)

  const galleries: SubGallery[] = subGalleries.map(sub => ({
    slug: sub.fields.slug,
    title: sub.fields.title,
    images: resolveAssetList(sub.fields.images, res.includes),
  }))

  return {
    title: entry.fields.title,
    slug: entry.fields.slug,
    metaDescription: entry.fields.metaDescription,
    publishDate: entry.fields.publishDate,
    tags: resolveTags(entry.fields.tags, res.includes),
    shareImage: resolveAsset(entry.fields.shareImage, res.includes),
    body: entry.fields.body,
    galleries,
  }
}

export async function getAbout(): Promise<About | undefined> {
  const res = await fetchEntries<{
    title: string
    headline?: string
    heroImage?: unknown
    shareImage?: unknown
    body: string
  }>(CONTENT_TYPE.about, { include: '1' })

  const entry = res.items[0]
  if (!entry) return undefined

  return {
    title: entry.fields.title,
    headline: entry.fields.headline,
    heroImage: resolveAsset(entry.fields.heroImage, res.includes),
    shareImage: resolveAsset(entry.fields.shareImage, res.includes),
    body: entry.fields.body,
  }
}

/**
 * Guards against a Contentful editor typing a gallery slug that collides
 * with a reserved top-level route. Call this once, e.g. from
 * app/[slug]/page.tsx's generateStaticParams, so a collision fails the
 * build loudly instead of silently shadowing a real route.
 */
const RESERVED_SLUGS = new Set(['blog', 'about', 'contact', 'api'])

export function assertNoReservedSlugCollisions(slugs: string[]) {
  const collisions = slugs.filter(slug => RESERVED_SLUGS.has(slug))
  if (collisions.length > 0) {
    throw new Error(
      `Gallery slug(s) collide with reserved routes: ${collisions.join(', ')}. Rename in Contentful.`
    )
  }
}
