/**
 *
 */

import type { MetadataRoute } from "next"
import { application } from "~/config"

/**
 * @todo [P3] Optimize sitemap once MVP is stable.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const origin = application.locations.origins.current
    const now = new Date()

    const urls: MetadataRoute.Sitemap = [
        {
            url: origin,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1
        }
    ]

    return urls
}
