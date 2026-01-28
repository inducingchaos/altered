/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { StatefulConstruct } from "../altered-constructs"
import type { ALTEREDInterface } from "../altered-interfaces"

/**
 * @todo [P3] Review the ambiguity between the Action name and title.
 *
 * @todo [P4] Review if hoisting the `ID` generic is actually needed.
 */
type Action<ID extends string = string> = StatefulConstruct<ID> & {
    type: "action"

    /**
     * An icon identifier.
     */
    icon?: string

    /**
     * The display name of the Action.
     */
    name: string

    /**
     * A short title representing the deliverable of the Action.
     */
    title: string

    /**
     * Text describing the deliverable of the Action.
     */
    description: string

    /**
     * An character sequence that can be used to auto-select an Action from the Action Palette.
     */
    trigger?: string

    /**
     * The Interfaces that make up the Action.
     */
    interfaces: ALTEREDInterface<ID>[]
}

export type ALTEREDAction<ID extends string = string> = Action<ID>
