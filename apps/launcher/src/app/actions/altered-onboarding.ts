/**
 *
 */

import { ALTEREDAction } from "@altered/data/shapes"
import { Icon } from "@raycast/api"
import { alteredOnboardingEndInterface, alteredOnboardingStartInterface } from "app/interfaces"

export const alteredOnboardingAction = {
    id: "action-altered-onboarding",
    alias: "ALTERED Onboarding Action",
    content: "An ALTERED Action for onboarding a new user.",

    type: "action",

    icon: Icon.AddPerson,
    name: "ALTERED Onboarding",
    title: "Get Started with ALTERED",
    description: "Learn how to set up and use your ALTERED Brain.",

    interfaces: [alteredOnboardingStartInterface, alteredOnboardingEndInterface]
} satisfies ALTEREDAction
