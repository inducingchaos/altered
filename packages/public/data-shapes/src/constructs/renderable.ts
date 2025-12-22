/**
 *
 */

import { Component } from "../components"
import { ConstructState, StatefulConstruct } from "./stateful"

export type RenderableConstruct<ID extends string = string, State extends ConstructState = ConstructState> = StatefulConstruct<ID, State> & {
    /**
     * @remarks ALTERED Interfaces for Raycast should only accept a single root component. For now, we will allow multiple components on the type level to maintain flexibility for other implementations.
     *
     * @todo [P1] Guard against multiple Raycast components at runtime.
     */
    components?: Component[]
}
