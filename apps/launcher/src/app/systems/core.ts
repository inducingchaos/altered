/**
 *
 */

import type { ALTEREDSystem } from "@altered/core"
import {
    alteredOnboardingAction,
    captureThoughtAction,
    viewThoughtsAction
} from "../actions"

export const coreSystem = {
    id: "system-altered-core",
    alias: "ALTERED Core System",
    content: "The core system for managing your ALTERED Brain.",

    type: "system",

    name: "ALTERED Core",
    title: "Manage your Brain",
    description: "Organize and develop the contents of your ALTERED Brain.",

    actions: [alteredOnboardingAction, captureThoughtAction, viewThoughtsAction]
} satisfies ALTEREDSystem
