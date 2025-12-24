/**
 *
 */

import { systemPreferenceKeys } from "@altered-internal/data/shapes"
import { Database } from "@altered-internal/data/store"
import { setSystemPreference } from "../system-preferences"

export async function setMostRecentBrainId({ userId, brainId, db }: { userId: string; brainId: string; db: Database }) {
    return setSystemPreference({
        userId,
        key: systemPreferenceKeys.mostRecentBrainId,
        value: brainId,
        db
    })
}
