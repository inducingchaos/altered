/**
 *
 */

import { StatefulConstruct } from "./constructs"
import { Interface } from "./interfaces"

/**
 * @todo [P3] Review the ambiguity between the Action name and title.
 */
export type Action<ID extends string = string> = StatefulConstruct<ID> & {
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
     * An alias that can be used to auto-select an Action from the Action Palette.
     */
    trigger?: string

    /**
     * The Interfaces that make up the Action.
     */
    interfaces: Interface<ID>[]
}

export type ALTEREDAction<ID extends string = string> = Action<ID>
