/**
 *
 */

import type { ALTEREDAction } from "@altered/data/shapes"
import { Icon } from "@raycast/api"
import { connectToAiProviderCustomInterface } from "app/interfaces"

export const connectToAiProviderAction = {
    id: "action-connect-to-ai-provider",
    alias: "Connect to AI Provider Action",
    content: "An ALTERED Action for connecting to ALTERED's AI provider.",

    type: "action",

    icon: Icon.Key,
    name: "AI Provider",
    title: "Connect to AI Provider",
    description:
        "Get configuration values to use ALTERED AI in other applications.",

    interfaces: [connectToAiProviderCustomInterface]
} satisfies ALTEREDAction
