/**
 *
 */

import { type } from "arktype"
import { contractFactory } from "./factory"

export const aggregateContract = {
    raycast: {
        menuBarText: contractFactory
            .route({ tags: ["internal"] })
            .output(type({ content: "string" }))
    }
}
