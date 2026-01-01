/**
 *
 */

import type { CursorDefinition, Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Alert, Color, confirmAlert, Icon, List, popToRoot, showToast, Toast } from "@raycast/api"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { useState } from "react"
import { api as reactApi } from "~/api/react"
import { isVersionIncompatibleError as checkIsVersionIncompatibleError, VersionIncompatibleError } from "~/api/utils"
import { useAuthentication } from "~/auth"
import { config } from "~/config"
import { configureLogger } from "~/observability"
import { LogOutAction, ReturnToActionPaletteAction, withContext } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import { CaptureThought } from "../capture-thought"

const logger = configureLogger({ defaults: { scope: "commands:view-thoughts" } })

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
    const [isShowingInspector, setIsShowingInspector] = useState(false)
    /**
     * @remarks This serves as single-use-case navigation history state for the `CaptureThought` form. Once we have our own generic history implemented, we can replace this state.
     */
    const [isCreatingThought, setIsCreatingThought] = useState(false)

    const queryClient = useQueryClient()
    const thoughtsQueryKey = reactApi.thoughts.key()

    const getThoughtsQueryOptions = reactApi.thoughts.get.infiniteOptions({
        input: (pageParam: CursorDefinition | null) => ({
            pagination: {
                type: "cursor",
                cursors: pageParam ? [pageParam] : null,
                limit: config.listPaginationLimit
            }
        }),
        context: { authToken },

        initialPageParam: null,
        getNextPageParam: lastPage => {
            if (!lastPage.hasMore) return null

            const thoughts = lastPage.thoughts
            if (!thoughts || !thoughts.length) return null

            const lastThoughtIndex = thoughts.length - 1
            const lastThought = thoughts[lastThoughtIndex]

            const cursorDef: CursorDefinition = { field: "created-at", value: lastThought.createdAt }

            return cursorDef
        }
    })

    const getThoughtsQueryKey = getThoughtsQueryOptions.queryKey

    const { data, error, isFetching: isFetchingThoughts, hasNextPage, fetchNextPage } = useInfiniteQuery(getThoughtsQueryOptions)

    const createMutation = useMutation(
        reactApi.thoughts.create.mutationOptions({
            context: { authToken },

            onMutate: async thoughtInput => {
                await queryClient.cancelQueries({ queryKey: getThoughtsQueryKey })

                const staleData = queryClient.getQueryData(getThoughtsQueryKey)

                const optimisticThought: Thought = {
                    id: `optimistic-${Date.now()}`,
                    alias: thoughtInput.alias,
                    content: thoughtInput.content,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

                queryClient.setQueryData(getThoughtsQueryKey, staleData => {
                    const data = staleData ?? { pages: [], pageParams: [] }

                    const pageThoughtLimit = config.listPaginationLimit

                    const staleThoughts = data.pages.flatMap(page => page.thoughts ?? [])

                    const stalePageCount = data.pages.length
                    const staleDataHasMore = data.pages[stalePageCount - 1]?.hasMore ?? false

                    const updatedThoughts = [optimisticThought, ...staleThoughts]

                    const updatedPageCount = Math.ceil(updatedThoughts.length / pageThoughtLimit)

                    const updatedPages: typeof data.pages = []

                    for (const pageIndex of Array(updatedPageCount).keys()) {
                        const isLastPage = pageIndex === updatedPageCount - 1

                        const startThoughtIndex = pageIndex * pageThoughtLimit
                        const endThoughtIndex = startThoughtIndex + pageThoughtLimit

                        const pageThoughts = updatedThoughts.slice(startThoughtIndex, endThoughtIndex)

                        updatedPages.push({
                            thoughts: pageThoughts,
                            hasMore: isLastPage ? staleDataHasMore : true
                        })
                    }

                    return { ...data, pages: updatedPages }
                })

                return { staleData }
            },

            onError: (error, variables, context) => {
                logger.error({ title: "Failed to Create Thought", data: { error } })

                if (context?.staleData) queryClient.setQueryData(getThoughtsQueryKey, context.staleData)

                showToast({
                    style: Toast.Style.Failure,
                    title: "Failed to Create Thought",
                    message: "Please try again later."
                })
            },

            onSettled: () => {
                if (queryClient.isMutating({ mutationKey: thoughtsQueryKey }) === 1) queryClient.invalidateQueries({ queryKey: getThoughtsQueryKey })
            }
        })
    )

    const deleteMutation = useMutation(
        reactApi.thoughts.delete.mutationOptions({
            context: { authToken },

            onMutate: async variables => {
                await queryClient.cancelQueries({ queryKey: getThoughtsQueryKey })

                const staleData = queryClient.getQueryData(getThoughtsQueryKey)

                queryClient.setQueryData(getThoughtsQueryKey, staleData => {
                    const data = staleData ?? { pages: [], pageParams: [] }

                    const pageThoughtLimit = config.listPaginationLimit

                    const staleThoughts = data.pages.flatMap(page => page.thoughts ?? [])

                    const stalePageCount = data.pages.length
                    const staleDataHasMore = data.pages[stalePageCount - 1]?.hasMore ?? false

                    const updatedThoughts = staleThoughts.filter(thought => thought.id !== variables.id)

                    const updatedPageCount = Math.ceil(updatedThoughts.length / pageThoughtLimit) || 1

                    const updatedPages: typeof data.pages = []

                    for (const pageIndex of Array(updatedPageCount).keys()) {
                        const isLastPage = pageIndex === updatedPageCount - 1

                        const startThoughtIndex = pageIndex * pageThoughtLimit
                        const endThoughtIndex = startThoughtIndex + pageThoughtLimit

                        const pageThoughts = updatedThoughts.slice(startThoughtIndex, endThoughtIndex)

                        updatedPages.push({
                            thoughts: pageThoughts,
                            hasMore: isLastPage ? staleDataHasMore : true
                        })
                    }

                    return { ...data, pages: updatedPages }
                })

                return { staleData }
            },

            onError: (error, variables, context) => {
                logger.error({ title: "Failed to Delete Thought", data: { error } })

                if (context?.staleData) queryClient.setQueryData(getThoughtsQueryKey, context.staleData)

                showToast({
                    style: Toast.Style.Failure,
                    title: "Failed to Delete Thought",
                    message: "Please try again later."
                })
            },

            onSettled: () => {
                if (queryClient.isMutating({ mutationKey: thoughtsQueryKey }) === 1) queryClient.invalidateQueries({ queryKey: getThoughtsQueryKey })
            }
        })
    )

    const actionPaletteContext = useActionPalette({ safe: true })

    const thoughts = data?.pages.flatMap(page => page.thoughts ?? []) ?? null

    const isFetchingMutation = createMutation.isPending || deleteMutation.isPending
    const isFetching = isFetchingThoughts || isFetchingMutation

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

    const handleCreateThought = async (thought: { content: string; alias: string | null }) => createMutation.mutate(thought)

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
        pageSize: config.listPaginationLimit,
        hasMore: hasNextPage,
        onLoadMore: fetchNextPage
    }

    const createActions = (thought?: Thought) => (
        <ActionPanel>
            <ActionPanel.Section title="View">{thought && <Action title={`${isShowingInspector ? "Hide" : "Open"} Inspector`} onAction={() => setIsShowingInspector(prev => !prev)} shortcut={{ modifiers: ["cmd"], key: "i" }} icon={isShowingInspector ? Icon.EyeDisabled : Icon.Eye} />}</ActionPanel.Section>

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
        <List isLoading={isFetching} actions={createActions()} pagination={pagination} navigationTitle="View Thoughts" isShowingDetail={isShowingInspector}>
            {thoughts && thoughts.length === 0 && <List.EmptyView title="No thoughts found." description="Create your first thought to get started." icon={Icon.PlusTopRightSquare} />}

            {thoughts?.map(thought => (
                <List.Item
                    key={thought.id}
                    title={resolveItemTitle(thought)}
                    subtitle={resolveItemSubtitle(thought) ?? undefined}
                    actions={createActions(thought)}
                    accessories={
                        isShowingInspector
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
