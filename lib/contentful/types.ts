import type { ResolvedAsset } from './client'

export interface Tag {
  title: string
  slug: string
}

export interface Home {
  headline: string
  body: string
  heroImage?: ResolvedAsset
  shareImage?: ResolvedAsset
  youtubeLink?: string
  instagramLink?: string
  flickrLink?: string
  flickrStaticImg?: string
}

export interface BlogPage {
  title: string
  heroImage?: ResolvedAsset
  shareImage?: ResolvedAsset
  body: string
}

export interface Post {
  title: string
  slug: string
  publishDate: string
  tags: Tag[]
  heroImage?: ResolvedAsset
  body: string
}

export interface SubGallery {
  slug: string
  title: string
  images: ResolvedAsset[]
}

export interface ExtendedGallery {
  title: string
  slug: string
  metaDescription?: string
  publishDate: string
  tags: Tag[]
  shareImage?: ResolvedAsset
  body: string
  galleries: SubGallery[]
}

export interface About {
  title: string
  headline?: string
  heroImage?: ResolvedAsset
  shareImage?: ResolvedAsset
  body: string
}
