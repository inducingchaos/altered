/**
 *
 */

import { useState } from "react"
import { getPreferenceValues, Icon, List } from "@raycast/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { trpc } from "../../../lib/networking/rpc/client"
import { prettifyDate } from "../../../utils"
import { withContext } from "../../ui/headless/context-providers"
import { GlobalActions } from "./global-actions"
import { createThoughtDeletionMutationOptions, getAllThoughtsQueryOptions } from "./query-helpers"

/**
 * @todo [P1] Replace when auth is implemented.
 */
const { "user-id": userId }: { "user-id": string } = getPreferenceValues()

export default function Thoughts() {
    return withContext(<_Thoughts />)
}

function _Thoughts() {
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
                    <List.Item
                        key={thought.id}
                        title={`${thought.content}`}
                        detail={
                            <List.Item.Detail
                                markdown={thought.content}
                                metadata={
                                    <List.Item.Detail.Metadata>
                                        <List.Item.Detail.Metadata.Label
                                            title="Created"
                                            text={prettifyDate(thought.createdAt)}
                                        />
                                    </List.Item.Detail.Metadata>
                                }
                            />
                        }
                        actions={
                            <GlobalActions
                                thought={thought}
                                refreshThoughts={thoughtsQuery.refetch}
                                deleteThought={deleteThought.mutate}
                                isShowingDetail={isShowingDetail}
                                toggleDetail={toggleDetail}
                            />
                        }
                        accessories={[
                            {
                                date: thought.createdAt
                            }
                        ]}
                    />
                ))
            ) : (
                <List.EmptyView title="No thoughts yet." icon={Icon.Message} />
            )}
        </List>
    )
}
