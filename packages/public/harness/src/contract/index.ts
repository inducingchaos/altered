/**
 *
 */

import { InferContractRouterInputs, InferContractRouterOutputs } from "@orpc/contract"
import { experimentalContract } from "./experimental"
import { thoughtsContract } from "./thoughts"

export const contract = {
    thoughts: thoughtsContract,
    experimental: experimentalContract
}

export type RouterContractInputs = InferContractRouterInputs<typeof contract>
export type RouterContractOutputs = InferContractRouterOutputs<typeof contract>

export type RouterContract = typeof contract
