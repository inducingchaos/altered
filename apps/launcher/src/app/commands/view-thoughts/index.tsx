/**
 *
 */

import type {
    CreatableThought,
    QueryableThought,
    Thought,
    UpdatableThought
} from "@altered/core"
import {
    Action,
    ActionPanel,
    Alert,
    confirmAlert,
    environment,
    Icon,
    List,
    popToRoot,
    showToast,
    Toast
} from "@raycast/api"
import { useCachedState } from "@raycast/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo, useRef, useState } from "react"
import { usePersistQuery } from "~/api"
import { api as reactApi } from "~/api/react"
import {
    isVersionIncompatibleError as checkIsVersionIncompatibleError,
    VersionIncompatibleError
} from "~/api/utils"
import { useAuthentication } from "~/auth"
import { config } from "~/config"
import { configureLogger } from "~/observability"
import { ReturnToActionPaletteAction, withContext } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import { CaptureThought } from "../capture-thought"
import { EditThought } from "../edit-thought"
import {
    type InspectorLayoutID,
    ThoughtInspectorDetail,
    ThoughtInspectorListDetail
} from "./inspector"
import type { HandleDeleteThought, HandleUpdateThought } from "./shared"
import {
    ThoughtListActions,
    type ThoughtListActionsProps
} from "./thought-list-actions"
import { useThoughts } from "./use-thoughts"
import { useThoughtsQueryOptions } from "./use-thoughts-query-options"

const logger = configureLogger({
    defaults: { scope: "commands:view-thoughts" }
})

function AuthView() {
    const { isLoading, authenticate } = useAuthentication()

    const actionPaletteContext = useActionPalette({ safe: true })

    return (
        <List
            actions={
                <ActionPanel>
                    {isLoading ? null : (
                        <Action onAction={authenticate} title="Authenticate" />
                    )}

                    {actionPaletteContext && (
                        <ReturnToActionPaletteAction
                            resetNavigationState={
                                actionPaletteContext.resetState
                            }
                        />
                    )}
                </ActionPanel>
            }
            isLoading={isLoading}
        >
            {isLoading ? null : (
                <List.EmptyView
                    description="Sign in to access your ALTERED Brain."
                    icon={Icon.Lock}
                    title="Authenticate to view your thoughts."
                />
            )}
        </List>
    )
}

const resolveItemTitle = (thought: Thought) =>
    thought.alias?.length ? thought.alias : (thought.content ?? "No content.")
const resolveItemSubtitle = (thought: Thought) =>
    thought.alias?.length ? (thought.content ?? "No content.") : null

function ThoughtsList({ authToken }: { authToken: string }) {
    const [selectedThoughtId, setSelectedThoughtId] = useState<string | null>(
        null
    )

    const [isShowingInspector, setIsShowingInspector] = useCachedState(
        "is-showing-inspector",
        false,
        {
            cacheNamespace: environment.commandName
        }
    )

    const [inspectorLayoutId, setInspectorLayoutId] =
        useCachedState<InspectorLayoutID>("inspector-layout-id", "balanced", {
            cacheNamespace: environment.commandName
        })

    /**
     * @remarks This serves as single-use-case navigation history state for the `CaptureThought` form. Once we have our own generic history implemented, we can replace this state.
     */
    const [isCreatingThought, setIsCreatingThought] = useState(false)
    const [editingThoughtId, setEditingThoughtId] = useState<string | null>(
        null
    )

    const queryClient = useQueryClient()
    const { setPersistentQueryData } = usePersistQuery()

    const thoughtsQueryKey = reactApi.thoughts.key()

    const { queryKey: getThoughtsQueryKey } = useThoughtsQueryOptions()
    const {
        isFetching: isFetchingThoughts,
        thoughts,
        error,
        refresh,
        pagination
    } = useThoughts()

    const accessoriesCache = useRef(new Map<string, List.Item.Accessory[]>())

    const getAccessories = useCallback(
        (thought: Thought) => {
            if (isShowingInspector) return null

            if (!accessoriesCache.current.has(thought.id))
                accessoriesCache.current.set(thought.id, [
                    {
                        date: thought.createdAt,
                        tooltip: `Created: ${thought.createdAt.toLocaleString()}`
                    }
                ])

            const cached = accessoriesCache.current.get(thought.id)
            if (!cached)
                throw new Error(
                    `Accessories cache miss for thought ID: '${thought.id}'. This should never happen.`
                )

            return cached
        },
        [isShowingInspector]
    )

    const onCreateMutate = useCallback(
        async (thoughtInput: CreatableThought) => {
            await queryClient.cancelQueries({
                queryKey: getThoughtsQueryKey
            })

            const staleData = queryClient.getQueryData(getThoughtsQueryKey)

            if (!thoughtInput.id)
                throw new Error(
                    "Thought ID is missing - unable to perform optimistic update. In order for our optimistic updates to work, the Thought ID must be created on the client and passed to the mutation."
                )

            const optimisticThought: Thought = {
                id: thoughtInput.id,
                alias: thoughtInput.alias,
                content: thoughtInput.content,
                createdAt: new Date(),
                updatedAt: new Date(),
                addedAt: new Date()
            }

            setPersistentQueryData(getThoughtsQueryKey, staleData => {
                const data = staleData ?? { pages: [], pageParams: [] }

                const pageThoughtLimit = config.listPaginationLimit

                const staleThoughts = data.pages.flatMap(
                    page => page.thoughts ?? []
                )

                const stalePageCount = data.pages.length
                const staleDataHasMore =
                    data.pages[stalePageCount - 1]?.hasMore ?? false

                const updatedThoughts = [optimisticThought, ...staleThoughts]

                const updatedPageCount = Math.ceil(
                    updatedThoughts.length / pageThoughtLimit
                )

                const updatedPages: typeof data.pages = []

                for (const pageIndex of new Array(updatedPageCount).keys()) {
                    const isLastPage = pageIndex === updatedPageCount - 1

                    const startThoughtIndex = pageIndex * pageThoughtLimit
                    const endThoughtIndex = startThoughtIndex + pageThoughtLimit

                    const pageThoughts = updatedThoughts.slice(
                        startThoughtIndex,
                        endThoughtIndex
                    )

                    updatedPages.push({
                        thoughts: pageThoughts,
                        hasMore: isLastPage ? staleDataHasMore : true
                    })
                }

                return { ...data, pages: updatedPages }
            })

            return { staleData }
        },
        [queryClient, getThoughtsQueryKey, setPersistentQueryData]
    )

    const onCreateError = useCallback(
        (
            error: Error,
            _variables: CreatableThought,
            context: { staleData: unknown } | undefined
        ) => {
            logger.error({
                title: "Failed to Create Thought",
                description: error.message,
                data: { error }
            })

            if (context?.staleData)
                setPersistentQueryData(getThoughtsQueryKey, context.staleData)

            showToast({
                style: Toast.Style.Failure,
                title: "Failed to Create Thought",
                message: "Please try again later."
            })
        },
        [getThoughtsQueryKey, setPersistentQueryData]
    )

    const onCreateSettled = useCallback(() => {
        if (
            queryClient.isMutating({
                mutationKey: thoughtsQueryKey
            }) === 1
        )
            queryClient.invalidateQueries({
                queryKey: getThoughtsQueryKey
            })
    }, [queryClient, thoughtsQueryKey, getThoughtsQueryKey])

    const onDeleteMutate = useCallback(
        async (variables: { id: string }) => {
            await queryClient.cancelQueries({
                queryKey: getThoughtsQueryKey
            })

            const staleData = queryClient.getQueryData(getThoughtsQueryKey)

            setPersistentQueryData(getThoughtsQueryKey, staleData => {
                const data = staleData ?? { pages: [], pageParams: [] }

                const pageThoughtLimit = config.listPaginationLimit

                const staleThoughts = data.pages.flatMap(
                    page => page.thoughts ?? []
                )

                const stalePageCount = data.pages.length
                const staleDataHasMore =
                    data.pages[stalePageCount - 1]?.hasMore ?? false

                const updatedThoughts = staleThoughts.filter(
                    thought => thought.id !== variables.id
                )

                const updatedPageCount =
                    Math.ceil(updatedThoughts.length / pageThoughtLimit) || 1

                const updatedPages: typeof data.pages = []

                for (const pageIndex of new Array(updatedPageCount).keys()) {
                    const isLastPage = pageIndex === updatedPageCount - 1

                    const startThoughtIndex = pageIndex * pageThoughtLimit
                    const endThoughtIndex = startThoughtIndex + pageThoughtLimit

                    const pageThoughts = updatedThoughts.slice(
                        startThoughtIndex,
                        endThoughtIndex
                    )

                    updatedPages.push({
                        thoughts: pageThoughts,
                        hasMore: isLastPage ? staleDataHasMore : true
                    })
                }

                return { ...data, pages: updatedPages }
            })

            return { staleData }
        },
        [queryClient, getThoughtsQueryKey, setPersistentQueryData]
    )

    const onDeleteError = useCallback(
        (
            error: Error,
            _variables: { id: string },
            context: { staleData: unknown } | undefined
        ) => {
            logger.error({
                title: "Failed to Delete Thought",
                data: { error }
            })

            if (context?.staleData)
                setPersistentQueryData(getThoughtsQueryKey, context.staleData)

            showToast({
                style: Toast.Style.Failure,
                title: "Failed to Delete Thought",
                message: "Please try again later."
            })
        },
        [getThoughtsQueryKey, setPersistentQueryData]
    )

    const onDeleteSettled = useCallback(() => {
        if (
            queryClient.isMutating({
                mutationKey: thoughtsQueryKey
            }) === 1
        )
            queryClient.invalidateQueries({
                queryKey: getThoughtsQueryKey
            })
    }, [queryClient, thoughtsQueryKey, getThoughtsQueryKey])

    const onUpdateMutate = useCallback(
        async ({
            query: thoughtQuery,
            values: thoughtValues
        }: {
            query: QueryableThought
            values: UpdatableThought
        }) => {
            await queryClient.cancelQueries({
                queryKey: getThoughtsQueryKey
            })

            const staleData = queryClient.getQueryData(getThoughtsQueryKey)

            setPersistentQueryData(getThoughtsQueryKey, staleData => {
                const data = staleData ?? { pages: [], pageParams: [] }

                const updatedPages = data.pages.map(page => ({
                    ...page,
                    thoughts:
                        page.thoughts?.map(thought =>
                            thought.id === thoughtQuery.id
                                ? {
                                      ...thought,
                                      ...(thoughtValues.alias !== undefined && {
                                          alias: thoughtValues.alias
                                      }),
                                      ...(thoughtValues.content !==
                                          undefined && {
                                          content: thoughtValues.content
                                      }),
                                      updatedAt: new Date()
                                  }
                                : thought
                        ) ?? []
                }))

                return { ...data, pages: updatedPages }
            })

            return { staleData }
        },
        [queryClient, getThoughtsQueryKey, setPersistentQueryData]
    )

    const onUpdateError = useCallback(
        (
            error: Error,
            _variables: unknown,
            context: { staleData: unknown } | undefined
        ) => {
            logger.error({
                title: "Failed to Update Thought",
                data: { error }
            })

            if (context?.staleData)
                setPersistentQueryData(getThoughtsQueryKey, context.staleData)

            showToast({
                style: Toast.Style.Failure,
                title: "Failed to Update Thought",
                message: "Please try again later."
            })
        },
        [getThoughtsQueryKey, setPersistentQueryData]
    )

    const onUpdateSettled = useCallback(() => {
        if (
            queryClient.isMutating({
                mutationKey: thoughtsQueryKey
            }) === 1
        )
            queryClient.invalidateQueries({
                queryKey: getThoughtsQueryKey
            })
    }, [queryClient, thoughtsQueryKey, getThoughtsQueryKey])

    const createMutationOptions = useMemo(
        () =>
            reactApi.thoughts.create.mutationOptions({
                context: { authToken },
                onMutate: onCreateMutate,
                onError: onCreateError,
                onSettled: onCreateSettled
            }),
        [authToken, onCreateMutate, onCreateError, onCreateSettled]
    )

    const deleteMutationOptions = useMemo(
        () =>
            reactApi.thoughts.delete.mutationOptions({
                context: { authToken },
                onMutate: onDeleteMutate,
                onError: onDeleteError,
                onSettled: onDeleteSettled
            }),
        [authToken, onDeleteMutate, onDeleteError, onDeleteSettled]
    )

    const updateMutationOptions = useMemo(
        () =>
            reactApi.thoughts.update.mutationOptions({
                context: { authToken },
                onMutate: onUpdateMutate,
                onError: onUpdateError,
                onSettled: onUpdateSettled
            }),
        [authToken, onUpdateMutate, onUpdateError, onUpdateSettled]
    )

    const createMutation = useMutation(createMutationOptions)

    const deleteMutation = useMutation(deleteMutationOptions)

    const updateMutation = useMutation(updateMutationOptions)

    const actionPaletteContext = useActionPalette({ safe: true })

    const handleCreateThought = useCallback(
        (thought: CreatableThought) => createMutation.mutate(thought),
        [createMutation.mutate]
    )

    const handleUpdateThought = useCallback<HandleUpdateThought>(
        props => updateMutation.mutate(props),
        [updateMutation.mutate]
    )

    const handleDeleteThought = useCallback<HandleDeleteThought>(
        async (thought, props) => {
            const { showConfirmation = true } = props ?? {}

            if (showConfirmation) {
                const thoughtSummary = thought.alias ?? thought.content ?? null
                const thoughtDescriptor = thoughtSummary
                    ? `"${thoughtSummary.length > 10 ? `${thoughtSummary.slice(0, 16)}...` : thoughtSummary}"`
                    : "this thought"

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
        },
        [deleteMutation.mutate]
    )

    const selectedThoughtIndex = useMemo(() => {
        if (!thoughts) return -1

        return thoughts.findIndex(thought => thought.id === selectedThoughtId)
    }, [thoughts, selectedThoughtId])

    const selectNextThought = useCallback(() => {
        if (!thoughts || selectedThoughtIndex === -1) return

        setSelectedThoughtId(
            thoughts[(selectedThoughtIndex + 1) % thoughts.length]?.id ?? null
        )
    }, [thoughts, selectedThoughtIndex])

    const selectPreviousThought = useCallback(() => {
        if (!thoughts || selectedThoughtIndex === -1) return

        setSelectedThoughtId(
            thoughts[
                (selectedThoughtIndex - 1 + thoughts.length) % thoughts.length
            ]?.id ?? null
        )
    }, [thoughts, selectedThoughtIndex])

    const actionProps = useMemo<ThoughtListActionsProps>(
        () => ({
            isShowingInspector,
            setIsShowingInspector,
            inspectorLayoutId,
            setInspectorLayoutId,

            setIsCreatingThought,

            setEditingThoughtId,

            handleDeleteThought,

            refreshThoughts: refresh,

            selectNextThought,
            selectPreviousThought
        }),
        [
            isShowingInspector,
            inspectorLayoutId,
            setIsShowingInspector,
            setInspectorLayoutId,
            handleDeleteThought,
            refresh,
            selectNextThought,
            selectPreviousThought
        ]
    )

    const isFetchingMutation =
        createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending
    const isFetching = isFetchingThoughts || isFetchingMutation

    if (error) {
        const isVersionIncompatibleError =
            checkIsVersionIncompatibleError(error)

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

    const selectedThought =
        thoughts?.find(thought => thought.id === selectedThoughtId) ?? null

    if (isCreatingThought)
        return (
            <CaptureThought
                onCreateThought={handleCreateThought}
                pop={() => setIsCreatingThought(false)}
                shouldCloseOnSubmit={false}
            />
        )

    const isEditingThought = editingThoughtId !== null
    const editingThought =
        thoughts?.find(thought => thought.id === editingThoughtId) ?? null

    if (isEditingThought && editingThought)
        return (
            <EditThought
                onUpdateThought={handleUpdateThought}
                pop={() => setEditingThoughtId(null)}
                thought={editingThought}
            />
        )

    if (isShowingInspector && inspectorLayoutId === "full") {
        if (selectedThought)
            return (
                <ThoughtInspectorDetail
                    actions={
                        <ThoughtListActions
                            {...actionProps}
                            thought={selectedThought}
                        />
                    }
                    layoutId={inspectorLayoutId}
                    thought={selectedThought}
                />
            )

        setIsShowingInspector(false)
    }

    return (
        <List
            actions={<ThoughtListActions {...actionProps} />}
            isLoading={isFetching}
            isShowingDetail={isShowingInspector}
            navigationTitle="View Thoughts"
            onSelectionChange={setSelectedThoughtId}
            pagination={pagination}
            selectedItemId={selectedThoughtId ?? undefined}
        >
            <List.EmptyView
                description="Create your first thought to get started."
                icon={Icon.PlusTopRightSquare}
                title="No thoughts found."
            />

            {thoughts?.map(thought => (
                <List.Item
                    accessories={getAccessories(thought)}
                    actions={
                        <ThoughtListActions
                            {...actionProps}
                            thought={thought}
                        />
                    }
                    detail={
                        <ThoughtInspectorListDetail
                            layoutId={inspectorLayoutId}
                            thought={thought}
                        />
                    }
                    id={thought.id}
                    key={thought.id}
                    subtitle={resolveItemSubtitle(thought) ?? undefined}
                    title={resolveItemTitle(thought)}
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
