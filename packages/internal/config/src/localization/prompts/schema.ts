/**
 *
 */

import { z } from "zod"

export const promptsSchema = z.object({
    agentDescription: z.string(),

    thoughtsInstructions: z.string()
})

export type PromptsConfig = z.input<typeof promptsSchema>
export type Prompts = z.output<typeof promptsSchema>
