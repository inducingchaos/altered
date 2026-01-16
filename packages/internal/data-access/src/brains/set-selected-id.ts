/**
 *
 */

import { systemPreferenceKeys } from "@altered-internal/data/shapes"
import type { Database } from "@altered-internal/data/store"
import { setSystemPreference } from "../system-preferences"

export async function setSelectedBrainId({
    userId,
    brainId,
    db
}: {
    userId: string
    brainId: string
    db: Database
}) {
    return await setSystemPreference({
        userId,
        key: systemPreferenceKeys.selectedBrainId,
        value: brainId,
        db
    })
}
