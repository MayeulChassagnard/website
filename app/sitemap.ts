import type { MetadataRoute } from 'next'
import { getAllGallerySlugs, getAllPosts } from '@/lib/contentful/queries'
import { SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, gallerySlugs] = await Promise.all([
    getAllPosts().catch(() => []),
    getAllGallerySlugs().catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly' },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.publishDate,
    changeFrequency: 'monthly',
  }))

  const galleryRoutes: MetadataRoute.Sitemap = gallerySlugs.map(slug => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: 'monthly',
  }))

  return [...staticRoutes, ...postRoutes, ...galleryRoutes]
}
