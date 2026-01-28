/**
 * @todo [P4] Duplicate of contract in @altered/harness - resolve.
 */

import type {
    ErrorFromErrorMap,
    InferContractRouterErrorMap,
    InferContractRouterInputs,
    InferContractRouterOutputs
} from "@orpc/contract"
import { aggregateContract } from "./aggregate"
import { aiContract } from "./ai"
import { authContract } from "./auth"
import { experimentalContract } from "./experimental"
import { thoughtsContract } from "./thoughts"

export const contract = {
    auth: authContract,

    thoughts: thoughtsContract,
    ai: aiContract,

    aggregate: aggregateContract,
    experimental: experimentalContract
}

export type APIContract = typeof contract
export type APIInputs = InferContractRouterInputs<APIContract>
export type APIOutputs = InferContractRouterOutputs<APIContract>
export type APIError = ErrorFromErrorMap<
    InferContractRouterErrorMap<APIContract>
>
