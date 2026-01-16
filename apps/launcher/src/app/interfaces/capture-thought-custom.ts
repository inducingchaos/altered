/**
 *
 */

import type { ALTEREDInterface } from "@altered/data/shapes"
import { CaptureThought } from "app/commands/capture-thought"

export const captureThoughtCustomInterface = {
    id: "interface-capture-thought-custom",
    alias: "Capture Thought Custom Interface",
    content: "An ALTERED custom Interface for the Capture Thought Action.",

    type: "interface",
    custom: true,

    react: CaptureThought
} satisfies ALTEREDInterface
