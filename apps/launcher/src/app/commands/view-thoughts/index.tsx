/**
 *
 */

import type { CursorDefinition, Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Alert, Color, confirmAlert, Icon, List, popToRoot, showToast, Toast } from "@raycast/api"
import { usePromise } from "@raycast/utils"
import { DateTime } from "luxon"
import { useState } from "react"
import { api } from "~/api"
import { isVersionIncompatibleError, VersionIncompatibleError } from "~/api/utils"
import { useAuthentication } from "~/auth"
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
    const [isInspectorOpen, setIsInspectorOpen] = useState(false)

    const [isCreatingThought, setIsCreatingThought] = useState(false)

    const [isMutating, setIsMutating] = useState(false)

    const { isLoading, data, error, pagination, mutate } = usePromise(
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

            return { data: thoughts, hasMore, cursor }
        },

        [authToken]
    )

    const actionPaletteContext = useActionPalette({ safe: true })

    if (error) {
        if (isVersionIncompatibleError(error)) return <VersionIncompatibleError />

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
                }
            })

            if (!isConfirmed) return
        }

        setIsMutating(true)

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
                    optimisticUpdate: oldThoughts => (oldThoughts ?? []).filter(oldThought => oldThought.id !== thought.id)
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
            setIsMutating(false)
        }
    }

    const createActions = (thought?: Thought) => (
        <ActionPanel>
            <ActionPanel.Section title="View">
                <Action title={`${isInspectorOpen ? "Hide" : "Open"} Inspector`} onAction={() => setIsInspectorOpen(prev => !prev)} shortcut={{ modifiers: ["cmd"], key: "i" }} icon={isInspectorOpen ? Icon.EyeDisabled : Icon.Eye} />
            </ActionPanel.Section>

            <ActionPanel.Section title="Modify">
                <Action title="Create" onAction={() => setIsCreatingThought(true)} shortcut={{ modifiers: ["cmd"], key: "n" }} icon={Icon.PlusSquare} />

                <Action title="Edit" onAction={() => {}} shortcut={{ modifiers: ["cmd"], key: "e" }} icon={Icon.Pencil} />

                {thought && <Action title="Delete" onAction={() => handleDeleteThought(thought)} shortcut={{ modifiers: ["shift"], key: "delete" }} icon={Icon.Trash} style={Action.Style.Destructive} />}

                {thought && <Action title="Force Delete" onAction={() => handleDeleteThought(thought, { showConfirmation: false })} shortcut={{ modifiers: ["shift", "cmd"], key: "delete" }} icon={Icon.ExclamationMark} style={Action.Style.Destructive} />}
            </ActionPanel.Section>

            <ActionPanel.Section title="Navigate">{actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}</ActionPanel.Section>

            <ActionPanel.Section title="Configure">
                <LogOutAction />
            </ActionPanel.Section>
        </ActionPanel>
    )

    const itemDetailNoContentText = { value: "-", color: Color.SecondaryText }

    if (isCreatingThought) return <CaptureThought pop={() => setIsCreatingThought(false)} shouldCloseOnSubmit={false} />

    return (
        <List isLoading={isLoading || isMutating} actions={createActions()} pagination={pagination} navigationTitle="View Thoughts" isShowingDetail={isInspectorOpen}>
            {data?.length === 0 && <List.EmptyView title="No thoughts found." description="Create your first thought to get started." icon={Icon.PlusTopRightSquare} />}

            {data?.map(thought => (
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
 * @todo [P2] Add local caching to the Tanstack Query client for immediate thought retrieval.
 */
export function ViewThoughts() {
    logger.log()

    const { isAuthed, token } = useAuthentication()
    if (!isAuthed) return <AuthView />

    return <ThoughtsList authToken={token} />
}

export const ViewThoughtsCommand = withContext(ViewThoughts)
