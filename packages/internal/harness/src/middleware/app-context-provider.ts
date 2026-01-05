/**
 *
 */

import { getSelectedBrainId } from "@altered-internal/data/access"
import { ORPCError } from "@orpc/server"
import { APIAuthContext, APIDatabaseContext } from "../context"
import { apiFactory } from "../factory"

export const appContextProvider = apiFactory.$context<APIDatabaseContext & APIAuthContext>().middleware(async ({ context, next }) => {
    const selectedBrainId = await getSelectedBrainId({ userId: context.auth.user.id, db: context.db })

    if (!selectedBrainId) throw new ORPCError("NOT_FOUND", { message: "No selectable Brain found. This edge case should be handled by always creating a Brain during the onboarding flow, and enforcing the creation of a new one if it is deleted." })

    return next({
        context: {
            app: {
                selectedBrainId
            }
        }
    })
})
