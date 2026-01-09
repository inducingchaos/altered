/**
 *
 */

import { ALTEREDConstruct } from "../altered-constructs"

/**
 * Visual styles that indicate the type of an Operation.
 *
 * @remarks Previously included `"info" | "warning" | "error" | "success"`, however these are better suited for notifications and/or result UIs.
 */
export type OperationStyle = "default" | "destructive"

/**
 * The input types supported by an Operation.
 *
 * @todo [P3] Should eventually be converted to a Data type with Constraints.
 */
export type OperationInputType = "text" | "number" | "boolean" | "enum"

/**
 * @todo [P2] Refine this type when we start to implement Operations.
 */
export type OperationInputBase = ALTEREDConstruct & {
    type: "operation-input"

    inputId: string
    name: string
    description: string

    placeholder?: string
    required?: boolean
    defaultValue?: unknown
}

export type OperationTextInput = OperationInputBase & {
    inputType: "text"

    defaultValue?: string
}

export type OperationNumberInput = OperationInputBase & {
    inputType: "number"

    defaultValue?: number
}

export type OperationBooleanInput = OperationInputBase & {
    inputType: "boolean"

    defaultValue?: boolean
}

export type OperationEnumInput = OperationInputBase & {
    inputType: "enum"

    /**
     * @todo [P3] Expand to support enum options with per-option metadata.
     */
    options: string[]

    defaultValue?: string
}

export type OperationInput = OperationTextInput | OperationNumberInput | OperationBooleanInput | OperationEnumInput

/**
 * @todo [P2] Decide if this is the best way to group Operations when we start to implement them.
 */
export type OperationGroup<ID extends string> = {
    type: "operation-group"

    name: string

    operations: Operation<ID>[]
}

export type OperationInvocationEvent = "none" | "on-load"
export type OperationPlacement = "none" | "context-menu"

/**
 * @todo [P2] Refine - experimental.
 */
type BaseOperationDefinition = {
    type: "operation"

    inputs?: OperationInput[]

    /**
     * @remarks Should map the Operation's outputs to data keypaths in a State object.
     *
     * @todo [P2] Develop an output value definition type with metadata similar to `inputs`.
     */
    outputs?: Record<string, string>

    style?: OperationStyle

    invocationEvent?: OperationInvocationEvent
    placement?: OperationPlacement
}

export type PredefinedOperationDefinition<ID extends string> = BaseOperationDefinition & {
    /**
     * Type discriminator for predefined Operations.
     */
    _predefined?: true

    id: ID

    name?: string
    description?: string
}

export type CustomOperationDefinition = BaseOperationDefinition & {
    /**
     * Type discriminator for custom Operations.
     */
    _predefined?: false

    id: string

    name: string
    description: string
}

export type OperationDefinition<ID extends string> = PredefinedOperationDefinition<ID> | CustomOperationDefinition

type Operation<ID extends string = string> = OperationGroup<ID> | OperationDefinition<ID>

export type ALTEREDOperation<ID extends string = string> = Operation<ID>
