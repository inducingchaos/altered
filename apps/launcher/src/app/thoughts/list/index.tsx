/**
 *
 */

import { useState } from "react"
import { Icon, List } from "@raycast/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { userId } from "../../../lib/auth/user-id"
import { trpc } from "../../../lib/networking/rpc/client"
import { createThoughtDeletionMutationOptions, getAllThoughtsQueryOptions } from "../queries"
import { ThoughtListItem } from "./items"

export function Thoughts() {
    const queryClient = useQueryClient()
    const [isShowingDetail, setIsShowingDetail] = useState(false)

    const { data: thoughts, ...thoughtsQuery } = useQuery(getAllThoughtsQueryOptions({ userId }))
    const { data: thoughtCount } = useQuery(trpc.thoughts.count.queryOptions({ userId }))
    const deleteThought = useMutation(createThoughtDeletionMutationOptions({ client: queryClient, userId }))

    const isActive = thoughtsQuery.isFetching || deleteThought.isPending
    const toggleDetail = () => setIsShowingDetail(!isShowingDetail)
    const navigationTitle = thoughtCount ? `${thoughtCount} Thoughts` : undefined

    return (
        <List isLoading={isActive} navigationTitle={navigationTitle} isShowingDetail={isShowingDetail}>
            {thoughts?.length ? (
                thoughts.map(thought => (
                    <ThoughtListItem
                        key={thought.id}
                        thought={thought}
                        handleRefresh={thoughtsQuery.refetch}
                        handleDelete={deleteThought.mutate}
                        isShowingDetail={isShowingDetail}
                        toggleDetail={toggleDetail}
                    />
                ))
            ) : (
                <List.EmptyView title="No thoughts yet." icon={Icon.Message} />
            )}
        </List>
    )
}
