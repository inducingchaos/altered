/**
 *
 */

import type { QueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Action, ActionPanel, getPreferenceValues, Icon, List, showToast, Toast } from "@raycast/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DateTime } from "luxon"

import type { RouterOutputs } from "../../../lib/networking/rpc/client"
import { trpc } from "../../../lib/networking/rpc/client"
import { ContextProvider } from "../../ui/headless/context-providers"

const { "user-id": userId } = getPreferenceValues()

export default function ListThoughts() {
    return (
        <ContextProvider>
            <_ListThoughts />
        </ContextProvider>
    )
}

// Format date to a nice readable format
const formatDate = (date: Date) => {
    return DateTime.fromJSDate(date).toLocaleString({
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    })
}

function GlobalActions<T extends { id: string }>({
    thought,
    handleRefresh,
    handleDelete,
    isShowingDetail,
    toggleDetail
}: {
    thought: T
    handleRefresh: () => Promise<unknown>
    handleDelete: (thoughtId: Pick<T, "id">) => void
    isShowingDetail: boolean
    toggleDetail: () => void
}) {
    return (
        <ActionPanel>
            <Action
                title={isShowingDetail ? "Hide Detail" : "Show Detail"}
                icon={isShowingDetail ? Icon.EyeDisabled : Icon.Eye}
                shortcut={{ modifiers: ["cmd"], key: "i" }}
                onAction={toggleDetail}
            />

            <Action
                title="Refresh"
                shortcut={{ modifiers: ["cmd"], key: "r" }}
                onAction={async () => {
                    await handleRefresh()

                    await showToast({ style: Toast.Style.Success, title: "Refreshed Thoughts" })
                }}
            />

            <Action
                title="Delete"
                style={Action.Style.Destructive}
                onAction={() => handleDelete({ id: thought.id })}
                shortcut={{ modifiers: ["cmd"], key: "backspace" }}
            />
        </ActionPanel>
    )
}

const getAllThoughtsQueryOptions = (userId: string) => trpc.thoughts.all.queryOptions({ userId })

function _ListThoughts() {
    const queryClient = useQueryClient()
    const [isShowingDetail, setIsShowingDetail] = useState(false)

    const thoughtsQuery = useQuery(getAllThoughtsQueryOptions(userId))
    const thoughtsCountQuery = useQuery(trpc.thoughts.count.queryOptions({ userId }))

    const deleteThought = useMutation(createThoughtDeletionMutationOptions(queryClient))

    const isActive = thoughtsQuery.isFetching || deleteThought.isPending

    return (
        <List
            isLoading={isActive}
            navigationTitle={thoughtsCountQuery.data ? `${thoughtsCountQuery.data} thoughts` : undefined}
            isShowingDetail={isShowingDetail}
        >
            {thoughtsQuery.data?.length ? (
                thoughtsQuery.data?.map(thought => (
                    <List.Item
                        key={thought.id}
                        title={`${thought.content}`}
                        // subtitle={formatDate(thought.createdAt)}
                        detail={
                            <List.Item.Detail
                                markdown={thought.content}
                                metadata={
                                    <List.Item.Detail.Metadata>
                                        <List.Item.Detail.Metadata.Label title="Created" text={formatDate(thought.createdAt)} />
                                    </List.Item.Detail.Metadata>
                                }
                            />
                        }
                        actions={
                            <GlobalActions
                                thought={thought}
                                handleRefresh={thoughtsQuery.refetch}
                                handleDelete={deleteThought.mutate}
                                isShowingDetail={isShowingDetail}
                                toggleDetail={() => setIsShowingDetail(!isShowingDetail)}
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
                <List.EmptyView title="No thoughts yet" icon="💭" />
            )}
        </List>
    )
}

const createThoughtDeletionMutationOptions = (queryClient: QueryClient) =>
    trpc.thoughts.delete.mutationOptions({
        /**
         * @todo [P3] There might be a newer way to do optimistic updates.
         */
        onMutate: async deletedThought => {
            //  Avoid conflicts with optimistic updates.

            await queryClient.cancelQueries({ queryKey: getAllThoughtsQueryOptions(userId).queryKey })

            //  Snapshot prev.

            const previousData = queryClient.getQueryData(getAllThoughtsQueryOptions(userId).queryKey)

            //  Optimistically update state.

            queryClient.setQueryData(getAllThoughtsQueryOptions(userId).queryKey, (stale?: RouterOutputs["thoughts"]["all"]) =>
                stale?.filter(thought => thought.id !== deletedThought.id)
            )

            //  Return the previous state as context.

            return { previousData }
        },

        onError: (error, _, context) => {
            //  Roll back state.

            if (context?.previousData)
                queryClient.setQueryData(getAllThoughtsQueryOptions(userId).queryKey, context.previousData)

            showToast({ style: Toast.Style.Failure, title: "Deletion Failed", message: "Failed to delete thought." })
            console.error(error)
        },

        onSuccess: async () => await showToast({ style: Toast.Style.Success, title: "Thought Deleted" }),
        onSettled: () => queryClient.invalidateQueries({ queryKey: getAllThoughtsQueryOptions(userId).queryKey })
    })
