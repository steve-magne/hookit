import { allHooks } from '@/lib/hooks'
import type { MetadataRoute } from 'next'

const BASE = 'https://claudehooks.vercel.app'
const locales = ['en', 'fr'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${BASE}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${BASE}/${locale}/contribute`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ])

  const hookPages = locales.flatMap((locale) =>
    allHooks.map((hook) => ({
      url: `${BASE}/${locale}/hook/${hook.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticPages, ...hookPages]
}
