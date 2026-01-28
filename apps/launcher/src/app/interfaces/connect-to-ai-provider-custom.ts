/**
 *
 */

import type { ALTEREDInterface } from "@altered/core"
import { ConnectToAIProvider } from "app/commands/connect-to-ai-provider"

export const connectToAiProviderCustomInterface = {
    id: "interface-connect-to-ai-provider-custom",
    alias: "Connect to AI Provider Custom Interface",
    content:
        "An ALTERED custom Interface for the Connect to AI Provider Action.",

    type: "interface",
    custom: true,

    react: ConnectToAIProvider
} satisfies ALTEREDInterface
