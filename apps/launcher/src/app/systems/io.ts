/**
 *
 */

import { ALTEREDSystem } from "@altered/data/shapes"
import { generateLlmsTxtAction } from "app/actions"

export const ioSystem = {
    id: "system-altered-io",
    alias: "ALTERED IO System",
    content: "An ALTERED System for importing and exporting your thoughts.",

    type: "system",

    name: "ALTERED IO",
    title: "Import/Export your Thoughts",
    description: "Import or export Thoughts from your ALTERED Brain.",

    actions: [generateLlmsTxtAction]
} satisfies ALTEREDSystem
