/**
 *
 */

import type { ALTEREDInterface } from "@altered/data/shapes"
import { alteredOnboardingEndComponent } from "app/components"

export const alteredOnboardingEndInterface = {
    id: "interface-altered-onboarding-end",
    alias: "ALTERED Onboarding End Interface",
    content:
        "An ALTERED Interface for the end of the ALTERED Onboarding Action.",

    type: "interface",

    components: [alteredOnboardingEndComponent]
} satisfies ALTEREDInterface
