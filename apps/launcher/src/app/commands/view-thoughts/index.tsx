/**
 *
 */

import { Action, ActionPanel, Icon, List } from "@raycast/api"
import { useQuery } from "@tanstack/react-query"
import { api } from "~/api/react"
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
    const { error, isLoading, isPending, data } = useQuery(api.thoughts.get.queryOptions({ input: { limit: 25, offset: 0 }, context: { authToken } }))

    const actionPaletteContext = useActionPalette({ safe: true })

    if (error && isVersionIncompatibleError(error)) return <VersionIncompatibleError />

    const actions = (
        <ActionPanel>
            {actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}

            <LogOutAction />
        </ActionPanel>
    )

    return (
        <List isLoading={isLoading} actions={actions}>
            {isPending && null}

            {error && <List.EmptyView title="Error getting thoughts." description="Please try again later." icon={Icon.Xmark} />}

            {data?.thoughts === null && <List.EmptyView title="No thoughts found." description="Create your first thought to get started." icon={Icon.PlusTopRightSquare} />}

            {!isPending &&
                !error &&
                data.thoughts?.map(thought => (
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
