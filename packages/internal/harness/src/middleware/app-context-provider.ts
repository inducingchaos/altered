/**
 *
 */

import { getSelectedBrainId } from "@altered-internal/data/access"
import { APIAuthContext, APIDatabaseContext } from "../context"
import { apiFactory } from "../factory"

export const appContextProvider = apiFactory.$context<APIDatabaseContext & APIAuthContext>().middleware(async ({ context, next }) => {
    const selectedBrainId = await getSelectedBrainId({ userId: context.auth.user.id, db: context.db })

    return next({
        context: {
            app: {
                selectedBrainId
            }
        }
    })
})
