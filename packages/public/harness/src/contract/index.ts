/**
 *
 */

import { ErrorFromErrorMap, InferContractRouterErrorMap, InferContractRouterInputs, InferContractRouterOutputs } from "@orpc/contract"
import { experimentalContract } from "./experimental"
import { thoughtsContract } from "./thoughts"

export const contract = {
    thoughts: thoughtsContract,
    experimental: experimentalContract
}

export type APIInputs = InferContractRouterInputs<typeof contract>
export type APIOutputs = InferContractRouterOutputs<typeof contract>
export type APIError = ErrorFromErrorMap<InferContractRouterErrorMap<typeof contract>>

export type APIContract = typeof contract
