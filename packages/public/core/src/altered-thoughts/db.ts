/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

export type Thought = {
    id: string
    alias: string | null
    content: string | null
    addedAt: Date
    createdAt: Date
    updatedAt: Date
}

export type CreatableThought = Omit<
    Thought,
    "addedAt" | "createdAt" | "updatedAt"
> & {
    id?: string
    createdAt?: Date
    updatedAt?: Date
}

export type UpdatableThought = Omit<
    Thought,
    "id" | "createdAt" | "updatedAt" | "addedAt"
>

/**
 * @todo [P4] We could extrapolate this to accept any property of the Thought (as a union - or even more complex with and/or clauses), but for most cases, an ID is sufficient.
 */
export type QueryableThought = Pick<Thought, "id">
