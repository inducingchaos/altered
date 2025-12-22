/**
 *
 */

import { Action, testInterface } from "@altered/data/shapes"
import { Icon } from "@raycast/api"

export const generateLlmsTxtAction = {
    id: "action-generate-llms-txt",
    alias: "Generate LLMs.txt Action",
    content: "An ALTERED Action for generating a LLMs.txt file from your thoughts.",

    type: "action",

    icon: Icon.SaveDocument,
    name: "Generate LLMs.txt",
    title: "Generate a LLMs.txt File",
    description: "Generate a LLMs.txt file from your ALTERED Brain.",

    trigger: "llms",

    interfaces: [testInterface]
} satisfies Action
