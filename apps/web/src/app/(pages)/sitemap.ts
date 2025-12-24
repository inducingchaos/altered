/**
 *
 */

import { application } from "@altered-internal/config"
import type { MetadataRoute } from "next"

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
