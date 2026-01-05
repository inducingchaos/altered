/**
 *
 */

import type { CreatableThought, Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Alert, Color, confirmAlert, Icon, List, popToRoot, showToast, Toast } from "@raycast/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { useState } from "react"
import { api as reactApi } from "~/api/react"
import { isVersionIncompatibleError as checkIsVersionIncompatibleError, VersionIncompatibleError } from "~/api/utils"
import { useAuthentication } from "~/auth"
import { config } from "~/config"
import { configureLogger } from "~/observability"
import { ReturnToActionPaletteAction, withContext } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import { CaptureThought } from "../capture-thought"
import { EditThought } from "../edit-thought"
import { HandleDeleteThought, HandleUpdateThought } from "./shared"
import { ThoughtListActions, ThoughtListActionsProps } from "./thought-list-actions"
import { useThoughts } from "./use-thoughts"
import { useThoughtsQueryOptions } from "./use-thoughts-query-options"

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

const resolveItemTitle = (thought: Thought) => (thought.alias?.length ? thought.alias : (thought.content ?? "No content."))
const resolveItemSubtitle = (thought: Thought) => (thought.alias?.length ? (thought.content ?? "No content.") : null)

const itemDetailNoContentText = { value: "-", color: Color.SecondaryText }

function ThoughtsList({ authToken }: { authToken: string }) {
    const [isShowingInspector, setIsShowingInspector] = useState(false)
    /**
     * @remarks This serves as single-use-case navigation history state for the `CaptureThought` form. Once we have our own generic history implemented, we can replace this state.
     */
    const [isCreatingThought, setIsCreatingThought] = useState(false)
    const [editingThoughtId, setEditingThoughtId] = useState<string | null>(null)

    const queryClient = useQueryClient()
    const thoughtsQueryKey = reactApi.thoughts.key()

    const { queryKey: getThoughtsQueryKey } = useThoughtsQueryOptions()
    const { isFetching: isFetchingThoughts, thoughts, error, pagination } = useThoughts()

    const createMutation = useMutation(
        reactApi.thoughts.create.mutationOptions({
            context: { authToken },

            onMutate: async thoughtInput => {
                await queryClient.cancelQueries({ queryKey: getThoughtsQueryKey })

                const staleData = queryClient.getQueryData(getThoughtsQueryKey)

                if (!thoughtInput.id) throw new Error("Thought ID is missing - unable to perform optimistic update. In order for our optimistic updates to work, the Thought ID must be created on the client and passed to the mutation.")

                const optimisticThought: Thought = {
                    id: thoughtInput.id,
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
                logger.error({ title: "Failed to Create Thought", description: error.message, data: { error } })

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

    const updateMutation = useMutation(
        reactApi.thoughts.update.mutationOptions({
            context: { authToken },

            onMutate: async ({ query: thoughtQuery, values: thoughtValues }) => {
                await queryClient.cancelQueries({ queryKey: getThoughtsQueryKey })

                const staleData = queryClient.getQueryData(getThoughtsQueryKey)

                queryClient.setQueryData(getThoughtsQueryKey, staleData => {
                    const data = staleData ?? { pages: [], pageParams: [] }

                    const updatedPages = data.pages.map(page => ({
                        ...page,
                        thoughts:
                            page.thoughts?.map(thought =>
                                thought.id === thoughtQuery.id
                                    ? {
                                          ...thought,
                                          alias: thoughtValues.alias,
                                          content: thoughtValues.content,
                                          updatedAt: new Date()
                                      }
                                    : thought
                            ) ?? []
                    }))

                    return { ...data, pages: updatedPages }
                })

                return { staleData }
            },

            onError: (error, variables, context) => {
                logger.error({ title: "Failed to Update Thought", data: { error } })

                if (context?.staleData) queryClient.setQueryData(getThoughtsQueryKey, context.staleData)

                showToast({
                    style: Toast.Style.Failure,
                    title: "Failed to Update Thought",
                    message: "Please try again later."
                })
            },

            onSettled: () => {
                if (queryClient.isMutating({ mutationKey: thoughtsQueryKey }) === 1) queryClient.invalidateQueries({ queryKey: getThoughtsQueryKey })
            }
        })
    )

    const actionPaletteContext = useActionPalette({ safe: true })

    const isFetchingMutation = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
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

    const handleCreateThought = (thought: CreatableThought) => createMutation.mutate(thought)

    const handleUpdateThought: HandleUpdateThought = props => updateMutation.mutate(props)

    const handleDeleteThought: HandleDeleteThought = async (thought, props) => {
        const { showConfirmation = true } = props ?? {}

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

        return
    }

    if (isCreatingThought) return <CaptureThought pop={() => setIsCreatingThought(false)} shouldCloseOnSubmit={false} onCreateThought={handleCreateThought} />

    const isEditingThought = editingThoughtId !== null
    const editingThought = thoughts?.find(thought => thought.id === editingThoughtId) ?? null

    if (isEditingThought && editingThought) return <EditThought thought={editingThought} pop={() => setEditingThoughtId(null)} onUpdateThought={handleUpdateThought} />

    const actionProps: ThoughtListActionsProps = {
        isShowingInspector,
        setIsShowingInspector,
        setIsCreatingThought,
        setEditingThoughtId,
        handleDeleteThought
    }

    return (
        <List isLoading={isFetching} actions={<ThoughtListActions {...actionProps} />} pagination={pagination} navigationTitle="View Thoughts" isShowingDetail={isShowingInspector}>
            <List.EmptyView title="No thoughts found." description="Create your first thought to get started." icon={Icon.PlusTopRightSquare} />

            {thoughts?.map(thought => (
                <List.Item
                    key={thought.id}
                    title={resolveItemTitle(thought)}
                    subtitle={resolveItemSubtitle(thought) ?? undefined}
                    actions={<ThoughtListActions {...actionProps} thought={thought} />}
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
