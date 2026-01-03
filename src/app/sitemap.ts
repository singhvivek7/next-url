import { MetadataRoute } from 'next'

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]
}
