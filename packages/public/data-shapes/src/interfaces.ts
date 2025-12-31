/**
 *
 */

import type { JSX } from "react"
import { Component, testComponent } from "./components"
import { ConstructState, RenderableConstruct } from "./constructs"

export type BaseInterface<ID extends string = string, State extends ConstructState = ConstructState> = RenderableConstruct<ID, State> & {
    type: "interface"
}

export type DefinedInterface<ID extends string = string, State extends ConstructState = ConstructState> = BaseInterface<ID, State> & {
    custom?: false

    components: Component[]

    react?: never
}

export type CustomInterface<ID extends string = string, State extends ConstructState = ConstructState> = BaseInterface<ID, State> & {
    custom: true

    components?: never

    react(props?: unknown): JSX.Element
}

export type Interface<ID extends string = string, State extends ConstructState = ConstructState> = DefinedInterface<ID, State> | CustomInterface<ID, State>

export type ALTEREDInterface<ID extends string = string, State extends ConstructState = ConstructState> = Interface<ID, State>

export const testInterface = {
    id: "interface-test",
    alias: "Test Interface",
    content: "An ALTERED Interface for testing.",

    type: "interface",

    components: [testComponent]
} satisfies Interface
