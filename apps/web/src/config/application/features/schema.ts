/**
 *
 */

import { z } from "zod"

export const featuresSchema = z.object({
    testFeature: z.object({
        flag: z.string(),
        enabled: z.boolean()
    })
})

export type FeaturesConfig = z.input<typeof featuresSchema>
export type Features = z.output<typeof featuresSchema>
