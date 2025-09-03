/**
 *
 */

import type { QueryClient } from "@tanstack/react-query"
import { showToast, Toast } from "@raycast/api"

import type { RouterOutputs } from "../../lib/networking/rpc/client"
import { trpc } from "../../lib/networking/rpc/client"

export const getAllThoughtsQueryOptions = ({ userId }: { userId: string }) => trpc.thoughts.all.queryOptions({ userId })

export const createThoughtDeletionMutationOptions = ({ client, userId }: { client: QueryClient; userId: string }) => {
    const queryKey = getAllThoughtsQueryOptions({ userId }).queryKey

    return trpc.thoughts.delete.mutationOptions({
        /**
         * @todo [P3] There might be a newer way to do optimistic updates.
         */
        onMutate: async thoughtToDelete => {
            await client.cancelQueries({ queryKey })
            const thoughtsBeforeUpdate = client.getQueryData(queryKey)

            client.setQueryData(queryKey, (stale?: RouterOutputs["thoughts"]["all"]) =>
                stale?.filter(thought => thought.id !== thoughtToDelete.id)
            )

            return { thoughtsBeforeUpdate }
        },

        onError: (error, _, context) => {
            if (context?.thoughtsBeforeUpdate) client.setQueryData(queryKey, context.thoughtsBeforeUpdate)

            showToast({ style: Toast.Style.Failure, title: "Deletion Failed", message: "Failed to delete thought." })
            console.error(error)
        },

        onSuccess: async () =>
            await showToast({ style: Toast.Style.Success, title: "Thought Deleted", message: "Thought deleted successfully." }),
        onSettled: () => client.invalidateQueries({ queryKey })
    })
}
