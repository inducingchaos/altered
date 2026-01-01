/**
 *
 */

import type { CursorDefinition, Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Alert, Color, confirmAlert, Icon, List, popToRoot, showToast, Toast } from "@raycast/api"
import { usePromise } from "@raycast/utils"
import { DateTime } from "luxon"
import { useRef, useState } from "react"
import { api } from "~/api"
import { isVersionIncompatibleError as checkIsVersionIncompatibleError, VersionIncompatibleError } from "~/api/utils"
import { useAuthentication } from "~/auth"
import { configureLogger } from "~/observability"
import { LogOutAction, ReturnToActionPaletteAction, withContext } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import { CaptureThought } from "../capture-thought"

const logger = configureLogger({ defaults: { scope: "commands:view-thoughts" } })

/**
 * An error that is thrown when a fetch completes, but is intentionally discarded to prevent conflicts with optimistic mutations.
 *
 * @remarks
 * - Necessary with `usePromise` to prevent stale revalidation results from overwriting optimistic updates.
 * - `usePromise` will set `data` to `undefined` when the error is thrown, so we use `fallbackDataRef` as a backup to preserve the last-known data (including optimistic mutations) until the next successful revalidation.
 * - We don't use an `AbortController` because `usePromise`'s `abortable` option only sets `signal.aborted = true`, and doesn't actually cancel in-flight executions. Our API client doesn't consume abort signals, so aborted fetches still complete and update `data` - wiping out all optimistic updates. Throwing an error after the fetch completes is a workaround that achieves the same result.
 *
 * Alternative approaches considered:
 *
 * - Storing + tracking optimistic data in separate state and merging with the completed fetch data (more complex).
 * - Replacing `usePromise` with Tanstack Query which has better built-in optimistic update handling (future improvement).
 * - Modifying the API client to consume abort signals (requires excessive changes).
 */
class StaleRevalidationError extends Error {
    constructor() {
        super("Data revalidation cancelled due to pending mutation(s).")
        this.name = "StaleRevalidationError"
    }
}

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

/**
 * @todo
 * - [P3] Consider replacing `usePromise` with a Tanstack Query hook.
 * - [P3] Fix bug where the list does not paginate at all after a mutation (create, delete, etc.).
 */
function ThoughtsList({ authToken }: { authToken: string }) {
    const [isInspectorOpen, setIsInspectorOpen] = useState(false)
    /**
     * @remarks This serves as single-use-case navigation history state for the `CaptureThought` form. Once we have our own generic history implemented, we can replace this state.
     */
    const [isCreatingThought, setIsCreatingThought] = useState(false)

    const [pendingMutationCount, setPendingMutationCount] = useState(0)
    /**
     * A ref mirror of `pendingMutationCount`.
     *
     * @remarks We use a ref (not state) to avoid closure capture issues and maintain synchronous access inside async functions.
     */
    const pendingMutationCountRef = useRef(0)
    const isFetchingMutationRef = pendingMutationCountRef.current > 0

    /**
     * A ref mirror of `usePromise`'s `data`.
     *
     * @remarks
     * Stores a copy of the last-known data for two reasons:
     *
     * 1. To display the previous data in the list when `data` is set to `undefined` (e.g., after a `StaleRevalidationError`).
     * 2. To provide the data to `optimisticUpdate` callbacks when the current data is undefined.
     *
     * - We use a ref (not state) to avoid closure capture issues and maintain synchronous access inside async functions.
     */
    const fallbackDataRef = useRef<Thought[]>([])

    const updatePendingMutationCount = (updater: (count: number) => number) => {
        setPendingMutationCount(count => {
            const newCount = updater(count)

            pendingMutationCountRef.current = newCount
            return newCount
        })
    }

    const {
        isLoading: isFetchingThoughts,
        data,
        error,
        pagination,
        mutate,
        revalidate
    } = usePromise(
        (authToken: string) => async (pagination: { cursor?: CursorDefinition }) => {
            const { data: apiData, error: apiError } = await api.thoughts.get(
                {
                    pagination: {
                        type: "cursor",
                        cursors: pagination.cursor ? [pagination.cursor] : null,
                        limit: 25
                    }
                },

                { context: { authToken } }
            )

            if (apiError) throw apiError

            const thoughts = apiData.thoughts ?? []
            const hasMore = thoughts.length === 25
            const cursor = { field: "created-at", value: thoughts[thoughts.length - 1].createdAt }

            if (isFetchingMutationRef) throw new StaleRevalidationError()

            return { data: thoughts, hasMore, cursor }
        },

        [authToken],
        {
            onError: error => {
                if (error instanceof StaleRevalidationError) return

                throw error
            }
        }
    )

    const actionPaletteContext = useActionPalette({ safe: true })

    if (data) fallbackDataRef.current = data

    /**
     * The data to display in the list.
     *
     * @remarks Uses `fallbackDataRef` when `data` is undefined (e.g., after a `StaleRevalidationError`).
     */
    const resolvedData = data ?? fallbackDataRef.current

    const isFetchingMutation = pendingMutationCount > 0
    const isFetching = isFetchingThoughts || isFetchingMutation

    if (error) {
        const isVersionIncompatibleError = checkIsVersionIncompatibleError(error)
        const isStaleRevalidationError = error instanceof StaleRevalidationError
        const isUnknownError = !(isVersionIncompatibleError || isStaleRevalidationError)

        if (isVersionIncompatibleError) return <VersionIncompatibleError />

        if (isUnknownError) {
            showToast({
                style: Toast.Style.Failure,
                title: "Error Getting Thoughts",
                message: "Please try again later."
            })

            if (actionPaletteContext) actionPaletteContext.resetState()
            else popToRoot({ clearSearchBar: true })

            console.error(error)
        }
    }

    const resolveItemTitle = (thought: Thought) => (thought.alias?.length ? thought.alias : (thought.content ?? "No content."))
    const resolveItemSubtitle = (thought: Thought) => (thought.alias?.length ? (thought.content ?? "No content.") : null)

    /**
     * @remarks Uses `pendingMutationCount` to debounce revalidation — only triggers `revalidate()` when all pending mutations have completed. This prevents intermediate revalidations from overwriting optimistic updates when multiple mutations happen in quick succession.
     */
    const handleCreateThought = async (thoughtInput: { content: string; alias: string | null }) => {
        updatePendingMutationCount(count => count + 1)

        try {
            await mutate(
                api.thoughts.create(thoughtInput, { context: { authToken } }).then(({ error }) => {
                    if (error) throw error
                }),

                {
                    optimisticUpdate: oldThoughts => {
                        const optimisticThought: Thought = {
                            id: `optimistic-${Date.now()}`,
                            alias: thoughtInput.alias,
                            content: thoughtInput.content,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }

                        const currentThoughts = oldThoughts ?? fallbackDataRef.current

                        return [optimisticThought, ...currentThoughts]
                    },
                    shouldRevalidateAfter: false
                }
            )
        } catch (error) {
            logger.error({ title: "Failed to Create Thought", data: { error } })

            await showToast({
                style: Toast.Style.Failure,
                title: "Failed to Create Thought",
                message: "Please try again later."
            })
        } finally {
            updatePendingMutationCount(count => {
                const newCount = count - 1

                const noPendingMutations = newCount === 0
                if (noPendingMutations) revalidate()

                return newCount
            })
        }
    }

    /**
     * @remarks Uses the same `pendingMutationCount` debouncing pattern as `handleCreateThought`.
     */
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

        updatePendingMutationCount(count => count + 1)

        try {
            await mutate(
                api.thoughts
                    .delete(
                        {
                            id: thought.id
                        },
                        { context: { authToken } }
                    )
                    .then(({ error }) => {
                        if (error) throw error
                    }),

                {
                    optimisticUpdate: oldThoughts => {
                        const currentThoughts = oldThoughts ?? fallbackDataRef.current

                        return currentThoughts.filter(oldThought => oldThought.id !== thought.id)
                    },
                    shouldRevalidateAfter: false
                }
            )
        } catch (error) {
            logger.error({ title: "Failed to Delete Thought", data: { error } })

            await showToast({
                style: Toast.Style.Failure,
                title: "Failed to Delete Thought",
                message: "Please try again later."
            })
        } finally {
            updatePendingMutationCount(count => {
                const newCount = count - 1

                const noPendingMutations = newCount === 0
                if (noPendingMutations) revalidate()

                return newCount
            })
        }
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
            {resolvedData?.length === 0 && <List.EmptyView title="No thoughts found." description="Create your first thought to get started." icon={Icon.PlusTopRightSquare} />}

            {resolvedData?.map(thought => (
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
