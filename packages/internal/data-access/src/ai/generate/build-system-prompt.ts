/**
 *
 */

import { localization } from "@altered-internal/config"
import { InternalThought } from "@altered-internal/data/shapes"
import { Database, thoughts } from "@altered-internal/data/store"
import { format } from "date-fns"
import { asc, eq } from "drizzle-orm"

/**
 * @todo
 * - [P3] Exclude drafts from context when they are implemented.
 * - [P2] Implement caching to avoid re-fetching thoughts from the database on every request.
 * - [P4] Consider separating tooling functions (like this) from data access functions?
 * - [P3] Improve the prompt itself (we could even make this a dynamic, app-level markdown file with template variables - this would limit our flexibility, but maybe we could add transformers for the variables or end result to our templating language?).
 * - [P2] Preview - increase observability by logging or creating a util.
 */
export async function buildSystemPrompt({ context }: { context: { brainId: string; db: Database } }): Promise<string> {
    const parts: string[] = []

    parts.push(`## Agent Description`)
    parts.push(localization.prompts.agentDescription)

    parts.push("## Thoughts Instructions")
    parts.push(localization.prompts.thoughtsInstructions)

    parts.push("## Thoughts")

    const allThoughts = await context.db.select().from(thoughts).where(eq(thoughts.brainId, context.brainId)).orderBy(asc(thoughts.createdAt))

    const hasThoughts = allThoughts.length

    if (!hasThoughts) parts.push("No thoughts found in this brain yet.")

    const isDraftThought = (thought: InternalThought) => !thought.alias && !thought.content

    if (hasThoughts) {
        const formattedThoughts = allThoughts
            .filter(thought => !isDraftThought(thought))
            .map(thought => {
                const thoughtLineParts: string[] = []

                const date = format(thought.createdAt, "MMM d, yyyy, h:mm a")
                thoughtLineParts.push(`[${date}] `)

                if (thought.alias) thoughtLineParts.push(thought.alias)

                if (thought.alias && thought.content) thoughtLineParts.push(": ")
                else thoughtLineParts.push(" ")

                if (thought.content) thoughtLineParts.push(thought.content)

                return thoughtLineParts.join("")
            })
            .join("\n")

        parts.push(formattedThoughts)
    }

    return parts.join("\n\n")
}
