/**
 *
 */

import { type } from "arktype"
import { contractFactory } from "./factory"

export const experimentalContract = {
    test: contractFactory.input(type({ hello: "string" })).output(type({ success: "boolean" })),

    protectedTest: contractFactory
        .route({ tags: ["internal"] })
        .input(type({ hello: "string" }))
        .output(type({ success: "boolean" }))
}
