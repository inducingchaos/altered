/**
 *
 */

import { Construct } from "."
import { Operation } from "../operations"

export type ConstructState<State extends Record<string, unknown> = Record<string, unknown>> = State

export type StatefulConstruct<ID extends string = string, State extends ConstructState = ConstructState> = Construct<ID> & {
    state?: State

    operations?: Operation[]
}
