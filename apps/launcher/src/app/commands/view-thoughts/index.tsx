/**
 *
 */

import type { CursorDefinition, Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Alert, Color, confirmAlert, Icon, List, popToRoot, showToast, Toast } from "@raycast/api"
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { useState } from "react"
import { api as reactApi } from "~/api/react"
import { isVersionIncompatibleError as checkIsVersionIncompatibleError, VersionIncompatibleError } from "~/api/utils"
import { useAuthentication } from "~/auth"
import { configureLogger } from "~/observability"
import { LogOutAction, ReturnToActionPaletteAction, withContext } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import { CaptureThought } from "../capture-thought"

const logger = configureLogger({ defaults: { scope: "commands:view-thoughts" } })

const paginationLimit = 25

function AuthView() {
    const { isLoading, authenticate } = useAuthentication()

    const actionPaletteContext = useActionPalette({ safe: true })

    return (
        <List
            isLoading={isLoading}
            actions={
                <ActionPanel>
                    {isLoading ? null : <Action title="Authenticate" onAction={authenticate} />}

                    {actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}
                </ActionPanel>
            }
        >
            {isLoading ? null : <List.EmptyView title="Authenticate to view your thoughts." icon={Icon.Lock} description="Sign in to access your ALTERED Brain." />}
        </List>
    )
}

function ThoughtsList({ authToken }: { authToken: string }) {
    const [isInspectorOpen, setIsInspectorOpen] = useState(false)
    /**
     * @remarks This serves as single-use-case navigation history state for the `CaptureThought` form. Once we have our own generic history implemented, we can replace this state.
     */
    const [isCreatingThought, setIsCreatingThought] = useState(false)

    /**
     * @remarks Do we need this, or can we consume the client as context within the query options?
     */
    const queryClient = useQueryClient()

    const infiniteQueryOptions = reactApi.thoughts.get.infiniteOptions({
        input: (pageParam: CursorDefinition | null) => ({
            pagination: {
                type: "cursor",
                cursors: pageParam ? [pageParam] : null,
                limit: paginationLimit
            }
        }),
        context: { authToken },

        initialPageParam: null,
        getNextPageParam: lastPage => {
            const thoughts = lastPage.thoughts ?? []
            if (thoughts.length < paginationLimit) return undefined

            const lastThought = thoughts[thoughts.length - 1]
            return { field: "created-at", value: lastThought.createdAt } satisfies CursorDefinition
        }
    })

    const thoughtsQueryKey = infiniteQueryOptions.queryKey

    //  REMARKS: Are these typings necessary? I believe the query options (and similar) should be implicitly typed.

    type ThoughtsPage = { thoughts: Thought[] | null }
    type ThoughtsInfiniteData = InfiniteData<ThoughtsPage, CursorDefinition | null>

    const { data, error, isFetching: isFetchingThoughts, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(infiniteQueryOptions)

    const createMutation = useMutation(
        reactApi.thoughts.create.mutationOptions({
            context: { authToken },

            onMutate: async thoughtInput => {
                await queryClient.cancelQueries({ queryKey: thoughtsQueryKey })

                const previousData = queryClient.getQueryData<ThoughtsInfiniteData>(thoughtsQueryKey)

                const optimisticThought: Thought = {
                    //  REMARKS: Is this the best strategy for an optimistic ID?
                    id: `optimistic-${Date.now()}`,
                    alias: thoughtInput.alias,
                    content: thoughtInput.content,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

                queryClient.setQueryData<ThoughtsInfiniteData>(thoughtsQueryKey, old => {
                    //  REMARKS: Should we instead optimistically update even if there is no previous data?

                    if (!old) return old

                    return {
                        ...old,

                        //  REMARKS: Is it right to insert the optimistic thought into the first page, even if it exceeds the pagination limit? Or should we cascade-update all pages?

                        pages: old.pages.map((page, index) => (index === 0 ? { ...page, thoughts: [optimisticThought, ...(page.thoughts ?? [])] } : page))
                    }
                })

                return { previousData }
            },

            //  REMARKS: Could we name `_variables` better?

            onError: (error, _variables, context) => {
                logger.error({ title: "Failed to Create Thought", data: { error } })

                //  REMARKS: Does this consider concurrent optimistic updates?

                if (context?.previousData) queryClient.setQueryData<ThoughtsInfiniteData>(thoughtsQueryKey, context.previousData)

                showToast({
                    style: Toast.Style.Failure,
                    title: "Failed to Create Thought",
                    message: "Please try again later."
                })
            },

            onSettled: () => queryClient.invalidateQueries({ queryKey: thoughtsQueryKey })
        })
    )

    const deleteMutation = useMutation(
        reactApi.thoughts.delete.mutationOptions({
            context: { authToken },

            onMutate: async ({ id }) => {
                await queryClient.cancelQueries({ queryKey: thoughtsQueryKey })

                const previousData = queryClient.getQueryData<ThoughtsInfiniteData>(thoughtsQueryKey)

                queryClient.setQueryData<ThoughtsInfiniteData>(thoughtsQueryKey, old => {
                    //  REMARKS: Should we still optimistically update even if there is no previous data?

                    if (!old) return old

                    return {
                        ...old,

                        //  REMARKS: Is it right to delete the thought from the first page, even if it exceeds the pagination limit? Or should we cascade-update all pages?

                        pages: old.pages.map(page => ({
                            ...page,

                            thoughts: (page.thoughts ?? []).filter(thought => thought.id !== id)
                        }))
                    }
                })

                return { previousData }
            },

            //  REMARKS: Could we name `_variables` better?

            onError: (error, _variables, context) => {
                logger.error({ title: "Failed to Delete Thought", data: { error } })

                //  REMARKS: Does this consider concurrent optimistic updates?

                if (context?.previousData) queryClient.setQueryData<ThoughtsInfiniteData>(thoughtsQueryKey, context.previousData)

                showToast({
                    style: Toast.Style.Failure,
                    title: "Failed to Delete Thought",
                    message: "Please try again later."
                })
            },
            onSettled: () => queryClient.invalidateQueries({ queryKey: thoughtsQueryKey })
        })
    )

    const actionPaletteContext = useActionPalette({ safe: true })

    /**
     * @remarks Should we default to null/undefined or an empty array here?
     */
    const thoughts = data?.pages.flatMap(page => page.thoughts ?? []) ?? []

    const isFetchingMutation = createMutation.isPending || deleteMutation.isPending
    const isFetching = isFetchingThoughts || isFetchingNextPage || isFetchingMutation

    if (error) {
        const isVersionIncompatibleError = checkIsVersionIncompatibleError(error)

        if (isVersionIncompatibleError) return <VersionIncompatibleError />

        showToast({
            style: Toast.Style.Failure,
            title: "Error Getting Thoughts",
            message: "Please try again later."
        })

        if (actionPaletteContext) actionPaletteContext.resetState()
        else popToRoot({ clearSearchBar: true })

        console.error(error)
    }

    const resolveItemTitle = (thought: Thought) => (thought.alias?.length ? thought.alias : (thought.content ?? "No content."))
    const resolveItemSubtitle = (thought: Thought) => (thought.alias?.length ? (thought.content ?? "No content.") : null)

    const handleCreateThought = async (thoughtInput: { content: string; alias: string | null }) => {
        createMutation.mutate(thoughtInput)
    }

    const handleDeleteThought = async (thought: Thought, { showConfirmation = true }: { showConfirmation?: boolean } = {}) => {
        if (showConfirmation) {
            const thoughtSummary = thought.alias ?? thought.content ?? null
            const thoughtDescriptor = thoughtSummary ? `"${thoughtSummary.length > 10 ? thoughtSummary.slice(0, 16) + "..." : thoughtSummary}"` : "this thought"

            const isConfirmed = await confirmAlert({
                title: "Delete Thought",
                message: `Are you sure you want to delete ${thoughtDescriptor}? This action cannot be undone.`,
                icon: Icon.Trash,

                primaryAction: {
                    title: "Delete",
                    style: Alert.ActionStyle.Destructive
                },

                /**
                 * @remarks Don't use, it doesn't work. Shows a nice checkbox but it shows up unchecked even after checking it. Could have to do with our dynamic confirmation message - but this is definitely a bug. Confirmation preferences should not be stored based on the content of the confirmation message.
                 */
                rememberUserChoice: false
            })

            if (!isConfirmed) return
        }

        deleteMutation.mutate({ id: thought.id })
    }

    const pagination = {
        pageSize: paginationLimit,
        hasMore: hasNextPage,
        onLoadMore: fetchNextPage
    }

    const createActions = (thought?: Thought) => (
        <ActionPanel>
            <ActionPanel.Section title="View">{thought && <Action title={`${isInspectorOpen ? "Hide" : "Open"} Inspector`} onAction={() => setIsInspectorOpen(prev => !prev)} shortcut={{ modifiers: ["cmd"], key: "i" }} icon={isInspectorOpen ? Icon.EyeDisabled : Icon.Eye} />}</ActionPanel.Section>

            <ActionPanel.Section title="Modify">
                <Action title="Create Thought" onAction={() => setIsCreatingThought(true)} shortcut={{ modifiers: ["cmd"], key: "n" }} icon={Icon.PlusCircle} />

                {thought && <Action title="Edit Thought" onAction={() => {}} shortcut={{ modifiers: ["cmd"], key: "e" }} icon={Icon.Pencil} />}

                {thought && <Action title="Delete Thought" onAction={() => handleDeleteThought(thought)} shortcut={{ modifiers: ["shift"], key: "delete" }} icon={Icon.Trash} style={Action.Style.Destructive} />}

                {thought && <Action title="Delete Without Confirmation" onAction={() => handleDeleteThought(thought, { showConfirmation: false })} shortcut={{ modifiers: ["shift", "cmd"], key: "delete" }} icon={Icon.Trash} style={Action.Style.Destructive} />}
            </ActionPanel.Section>

            <ActionPanel.Section title="Navigate">{actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}</ActionPanel.Section>

            <ActionPanel.Section title="Configure">
                <LogOutAction />
            </ActionPanel.Section>
        </ActionPanel>
    )

    const itemDetailNoContentText = { value: "-", color: Color.SecondaryText }

    if (isCreatingThought) return <CaptureThought pop={() => setIsCreatingThought(false)} shouldCloseOnSubmit={false} onCreateThought={handleCreateThought} />

    return (
        <List isLoading={isFetching} actions={createActions()} pagination={pagination} navigationTitle="View Thoughts" isShowingDetail={isInspectorOpen}>
            {thoughts.length === 0 && !isFetching && <List.EmptyView title="No thoughts found." description="Create your first thought to get started." icon={Icon.PlusTopRightSquare} />}

            {thoughts.map(thought => (
                <List.Item
                    key={thought.id}
                    title={resolveItemTitle(thought)}
                    subtitle={resolveItemSubtitle(thought) ?? undefined}
                    actions={createActions(thought)}
                    accessories={
                        isInspectorOpen
                            ? null
                            : [
                                  {
                                      date: thought.createdAt,
                                      tooltip: `Created: ${thought.createdAt.toLocaleString()}`
                                  }
                              ]
                    }
                    detail={
                        <List.Item.Detail
                            metadata={
                                <List.Item.Detail.Metadata>
                                    <List.Item.Detail.Metadata.Label title="Alias" text={thought.alias ?? itemDetailNoContentText} />

                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Content" text={thought.content ?? itemDetailNoContentText} />

                                    <List.Item.Detail.Metadata.Separator />
                                    <List.Item.Detail.Metadata.Label title="Created" text={{ value: DateTime.fromJSDate(thought.createdAt).toLocaleString(DateTime.DATETIME_FULL), color: Color.SecondaryText }} />
                                </List.Item.Detail.Metadata>
                            }
                        />
                    }
                />
            ))}
        </List>
    )
}

/**
 * @todo [P2] Add local caching for immediate thought retrieval.
 */
export function ViewThoughts() {
    logger.log()

    const { isAuthed, token } = useAuthentication()
    if (!isAuthed) return <AuthView />

    return <ThoughtsList authToken={token} />
}

export const ViewThoughtsCommand = withContext(ViewThoughts)
