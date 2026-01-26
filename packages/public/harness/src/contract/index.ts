/**
 *
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

export type APIInputs = InferContractRouterInputs<typeof contract>
export type APIOutputs = InferContractRouterOutputs<typeof contract>
export type APIError = ErrorFromErrorMap<
    InferContractRouterErrorMap<typeof contract>
>

export type APIContract = typeof contract
