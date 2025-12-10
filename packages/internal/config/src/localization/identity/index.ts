/**
 *
 */

import { type IdentityConfig, identitySchema } from "./schema"

const identityConfig: IdentityConfig = {
    name: "ALTERED",
    description: "Knowledge systems for the obsessed."
}

export const identity = identitySchema.parse(identityConfig)
