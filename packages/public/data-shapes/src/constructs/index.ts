/**
 *
 */

import { Thought } from "../thoughts"

export type ConstructType = "thought" | "system" | "action" | "component" | "operation" | "interface" | "state"

export type Construct<ID extends string = string> = Thought<ID> & {
    /**
     * Helps discriminate different types of Constructs from the generic Thought type.
     */
    type: ConstructType
}

export type ALTEREDConstruct<ID extends string = string> = Construct<ID>

export * from "./renderable"
export * from "./stateful"
