/**
 *
 */

import type { JSX } from "react"
import { ALTEREDComponent } from "../altered-components"
import { ConstructState, RenderableConstruct } from "../altered-constructs"

export type BaseInterface<ID extends string = string, State extends ConstructState = ConstructState> = RenderableConstruct<ID, State> & {
    type: "interface"
}

export type DefinedInterface<ID extends string = string, State extends ConstructState = ConstructState> = BaseInterface<ID, State> & {
    custom?: false

    components: ALTEREDComponent[]

    react?: never
}

export type CustomInterface<ID extends string = string, State extends ConstructState = ConstructState> = BaseInterface<ID, State> & {
    custom: true

    components?: never

    react(props?: unknown): JSX.Element
}

type Interface<ID extends string = string, State extends ConstructState = ConstructState> = DefinedInterface<ID, State> | CustomInterface<ID, State>

export type ALTEREDInterface<ID extends string = string, State extends ConstructState = ConstructState> = Interface<ID, State>
