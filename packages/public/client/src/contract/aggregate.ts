/**
 * @todo [P4] Duplicate of contract in @altered/harness - resolve.
 */

import { type } from "@orpc/contract"
import { contractFactory } from "./factory"

export const aggregateContract = {
    raycast: {
        menuBarText: contractFactory
            .route({ tags: ["internal"] })
            .output(type<{ content: string }>())
    }
}
