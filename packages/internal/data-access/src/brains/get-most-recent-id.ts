/**
 *
 */

import { systemPreferenceKeys } from "@altered-internal/data/shapes"
import { Database } from "@altered-internal/data/store"

export async function getMostRecentBrainId({ userId, db }: { userId: string; db: Database }) {
    const preference = await db.query.systemPreferences.findFirst({
        where: {
            userId,
            key: systemPreferenceKeys.mostRecentBrainId
        }
    })

    return preference?.value ?? null
}
