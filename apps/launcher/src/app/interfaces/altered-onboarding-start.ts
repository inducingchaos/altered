/**
 *
 */

import type { ALTEREDInterface } from "@altered/core"
import { alteredOnboardingStartComponent } from "app/components"

export const alteredOnboardingStartInterface = {
    id: "interface-altered-onboarding-start",
    alias: "ALTERED Onboarding Start Interface",
    content:
        "An ALTERED Interface for the start of the ALTERED Onboarding Action.",

    type: "interface",

    components: [alteredOnboardingStartComponent]
} satisfies ALTEREDInterface
