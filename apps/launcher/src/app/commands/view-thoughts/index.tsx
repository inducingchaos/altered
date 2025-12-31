/**
 *
 */

import type { CursorDefinition, Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Color, Icon, List, popToRoot, showToast, Toast } from "@raycast/api"
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [setOptimisticThoughts] = useState<Thought[]>([])

    //  REMARKS: When we create a thought via our API using the `CaptureThought`, with RQ our `ThoughtsList` would usually be automatically invalidated and re-fetched, however since we're using Raycast's `usePromise`, we need to manually invalidate and update the data. While doing so, we should use `usePromise`'s optimistic feature to provide an update immediately.

    const { isLoading, data, error, pagination } = usePromise(
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

    const actions = (
        <ActionPanel>
            <ActionPanel.Section title="View">
                <Action title={`${isInspectorOpen ? "Hide" : "Open"} Inspector`} onAction={() => setIsInspectorOpen(prev => !prev)} shortcut={{ modifiers: ["cmd"], key: "i" }} icon={isInspectorOpen ? Icon.EyeDisabled : Icon.Eye} />
            </ActionPanel.Section>

            <ActionPanel.Section title="Modify">
                <Action title="Create Thought" onAction={() => setIsCreatingThought(true)} shortcut={{ modifiers: ["cmd"], key: "n" }} icon={Icon.PlusSquare} />

                <Action title="Edit Thought" onAction={() => {}} shortcut={{ modifiers: ["cmd"], key: "e" }} icon={Icon.Pencil} />

                <Action title="Delete Thought" onAction={() => {}} shortcut={{ modifiers: ["cmd", "shift"], key: "delete" }} icon={Icon.Trash} style={Action.Style.Destructive} />
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
        <List isLoading={isLoading} actions={actions} pagination={pagination} navigationTitle="View Thoughts" isShowingDetail={isInspectorOpen}>
            {data?.length === 0 && <List.EmptyView title="No thoughts found." description="Create your first thought to get started." icon={Icon.PlusTopRightSquare} />}

            {data?.map(thought => (
                <List.Item
                    key={thought.id}
                    title={resolveItemTitle(thought)}
                    subtitle={resolveItemSubtitle(thought) ?? undefined}
                    actions={actions}
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
