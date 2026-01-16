/**
 *
 */

import { systemPreferenceKeys } from "@altered-internal/data/shapes"
import type { Database } from "@altered-internal/data/store"

/**
 * @todo [P2] Make sure the Brain ID from the preference key actually exists.
 */
export async function getSelectedBrainId({
    userId,
    db
}: {
    userId: string
    db: Database
}) {
    const preference = await db.query.systemPreferences.findFirst({
        where: {
            userId,
            key: systemPreferenceKeys.selectedBrainId
        }
    })

    if (preference) return preference.value

    const mostRecentBrain = await db.query.brains.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" }
    })

    return mostRecentBrain ? mostRecentBrain.id : null
}
