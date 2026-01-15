/**
 *
 */

import { ALTEREDOperation } from "../../altered-operations"
import { ALTEREDConstruct } from "../base"

export type ConstructState<State extends Record<string, unknown> = Record<string, unknown>> = State

export type StatefulConstruct<ID extends string = string, State extends ConstructState = ConstructState> = ALTEREDConstruct<ID> & {
    state?: State

    operations?: ALTEREDOperation[]
}
