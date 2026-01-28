/**
 *
 */

import type { ALTEREDSystem } from "@altered/core"
import {
    connectToAiProviderAction,
    generateLlmsTxtAction,
    importThoughtsAction
} from "app/actions"

export const ioSystem = {
    id: "system-altered-io",
    alias: "ALTERED IO System",
    content: "An ALTERED System for importing and exporting your thoughts.",

    type: "system",

    name: "ALTERED IO",
    title: "Import/Export your Thoughts",
    description: "Import or export Thoughts from your ALTERED Brain.",

    actions: [
        connectToAiProviderAction,
        generateLlmsTxtAction,
        importThoughtsAction
    ]
} satisfies ALTEREDSystem
