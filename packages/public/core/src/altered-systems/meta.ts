/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { ALTEREDAction } from "../altered-actions"
import type { ALTEREDConstruct } from "../altered-constructs"

type System<ID extends string = string> = ALTEREDConstruct<ID> & {
    type: "system"

    /**
     * The display name of the System.
     */
    name: string

    /**
     * A short title representing the objective of the System.
     */
    title: string

    /**
     * A short description of the objective of the System.
     */
    description: string

    /**
     * The actions that the System contains.
     */
    actions: ALTEREDAction<ID>[]
}

export type ALTEREDSystem<ID extends string = string> = System<ID>
