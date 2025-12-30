/**
 *
 */

import type { CursorDefinition } from "@altered/data/shapes"
import { Action, ActionPanel, Icon, List, popToRoot, showToast, Toast } from "@raycast/api"
import { usePromise } from "@raycast/utils"
import { api } from "~/api"
import { isVersionIncompatibleError, VersionIncompatibleError } from "~/api/utils"
import { useAuthentication } from "~/auth"
import { configureLogger } from "~/observability"
import { LogOutAction, ReturnToActionPaletteAction, withContext } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"

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

    const actions = (
        <ActionPanel>
            {actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}

            <LogOutAction />
        </ActionPanel>
    )

    return (
        <List isLoading={isLoading} actions={actions} pagination={pagination}>
            {data?.length === 0 && <List.EmptyView title="No thoughts found." description="Create your first thought to get started." icon={Icon.PlusTopRightSquare} />}

            {data?.map(thought => (
                <List.Item
                    key={thought.id}
                    title={thought.alias ?? "Untitled"}
                    subtitle={thought.content ?? ""}
                    actions={actions}
                    accessories={[
                        {
                            date: thought.createdAt,
                            tooltip: `Created: ${thought.createdAt.toLocaleString()}`
                        }
                    ]}
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
