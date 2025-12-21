/**
 *
 */

import { Action, testInterface } from "@altered/data/shapes"
import { Icon } from "@raycast/api"

/**
 * @todo [P1] Implement the Capture Thought Interface (register as a form component).
 */
export const captureThoughtAction = {
    id: "action-capture-thought",
    alias: "Capture Thought Action",
    content: "An ALTERED Action for capturing a new thought.",

    type: "action",

    icon: Icon.SpeechBubbleActive,
    name: "Capture Thought",
    title: "Capture a Thought",
    description: "Capture a new thought to your ALTERED Brain.",

    trigger: "c",

    interfaces: [testInterface]
} satisfies Action
