/**
 *
 */

import { type FeaturesConfig, featuresSchema } from "./schema"

const featuresConfig: FeaturesConfig = {
    testFeature: {
        flag: "test-feature",
        enabled: false
    }
}

export const features = featuresSchema.parse(featuresConfig)
