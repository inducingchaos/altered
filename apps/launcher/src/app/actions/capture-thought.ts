/**
 *
 */

import { ALTEREDAction } from "@altered/data/shapes"
import { Icon } from "@raycast/api"
import { captureThoughtCustomInterface } from "app/interfaces"

/**
 * @todo [P1] Implement the Capture Thought Interface (register as a form component).
 */
export const captureThoughtAction = {
    id: "action-capture-thought",
    alias: "Capture Thought Action",
    content: "An ALTERED Action for capturing a thought.",

    type: "action",

    icon: Icon.SpeechBubbleActive,
    name: "Capture Thought",
    title: "Capture a Thought",
    description: "Capture a thought to your ALTERED Brain.",

    trigger: "c",

    interfaces: [captureThoughtCustomInterface]
} satisfies ALTEREDAction
