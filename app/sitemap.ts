import type { MetadataRoute } from 'next'
import { PROJECTS } from '@/lib/content/projects'
import { SITE_URL } from '@/lib/content/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map(project => ({
    url: `${SITE_URL}/work/${project.slug}`,
    changeFrequency: 'yearly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes]
}
