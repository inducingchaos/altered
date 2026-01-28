/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { ALTEREDThought } from "../altered-thoughts"

export type ConstructType =
    | "thought"
    | "system"
    | "action"
    | "component"
    | "operation"
    | "interface"
    | "state"

type Construct<ID extends string = string> = ALTEREDThought<ID> & {
    /**
     * Helps discriminate different types of Constructs from the generic Thought type.
     */
    type: ConstructType
}

export type ALTEREDConstruct<ID extends string = string> = Construct<ID>
