/**
 * @todo [P3] Resolve ambiguity between the `ALTEREDThought` construct and the `Thought` type.
 *
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

export type ALTEREDThought<ID extends string = string> = {
    id: ID

    /**
     * An arbitrary name/title for the Thought.
     *
     * @remarks Named "alias" to reinforce the abstract nature of the "thought" construct, and how it is a secondary identifier that describes the content of a Thought.
     */
    alias: string

    /**
     * A sentence-like description of the Thought.
     *
     * @remarks Named "content" to avoid the redundancy of "thought" and the associations to "description", since Thought content should be a pure channeling of one's inner voice, rather than a summarization of it.
     */
    content: string
}
