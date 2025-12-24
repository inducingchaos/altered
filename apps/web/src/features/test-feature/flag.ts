/**
 *
 */

import { application } from "@altered-internal/config"
import { flag } from "flags/next"

export const testFeatureFlag = flag({
    key: "test-feature",
    decide: () => application.features.testFeature.enabled
})
