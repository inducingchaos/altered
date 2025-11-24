/**
 *
 */

import { flag } from "flags/next"
import { application } from "~/config"

export const testFeatureFlag = flag({
    key: "test-feature",
    decide: () => application.features.testFeature.enabled
})
