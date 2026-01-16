/**
 *
 */

import type { ValidateApiKeyInput } from "@altered/data/shapes"
import type { Database } from "@altered-internal/data/store"

type ValidateApiKeyProps = ValidateApiKeyInput & {
    context: {
        db: Database
    }
}

/**
 * @todo [P3] This could likely be renamed to `authenticateWithApiKey`, or change the return type to a boolean.
 */
export async function validateApiKey({
    query: { value },
    context: { db }
}: ValidateApiKeyProps): Promise<{ userId: string } | null> {
    const apiKey = await db.query.apiKeys.findFirst({
        where: { value }
    })

    if (!apiKey) return null

    return { userId: apiKey.userId }
}
