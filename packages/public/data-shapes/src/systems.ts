/**
 *
 */

import { Action } from "./actions"
import { Construct } from "./constructs"

export type System<ID extends string = string> = Construct<ID> & {
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
    actions: Action<ID>[]
}

export type ALTEREDSystem<ID extends string = string> = System<ID>
