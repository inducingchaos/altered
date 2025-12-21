/**
 *
 */

import { Action, ActionPanel, Detail } from "@raycast/api"
import { useQuery } from "@tanstack/react-query"
import { queryApi } from "~/api"
import { useAuthentication } from "~/auth/hooks"
import { configureLogger } from "~/observability"
import { LogOutAction, withContext } from "~/shared/components"

const logger = configureLogger({ defaults: { scope: "commands:show-latest-thought" } })

function ShowLatestThought() {
    logger.log()

    const { isAuthed, authenticate, authToken } = useAuthentication()

    if (isAuthed === null) return <Detail isLoading={true} />

    if (!isAuthed)
        return (
            <Detail
                markdown="Welcome! Please authenticate to continue."
                actions={
                    <ActionPanel>
                        <Action title={"Authenticate"} onAction={authenticate} />
                    </ActionPanel>
                }
            />
        )

    return <LatestThoughtView authToken={authToken} />
}

const ThoughtDetail = ({ content, isLoading }: { content: string; isLoading?: boolean }) => {
    return (
        <Detail
            isLoading={isLoading}
            markdown={content}
            actions={
                <ActionPanel>
                    <LogOutAction />
                </ActionPanel>
            }
        />
    )
}

export function LatestThoughtView({ authToken }: { authToken: string | null }) {
    const { data, isLoading } = useQuery(queryApi.thoughts.getLatest.queryOptions({ context: { authToken } }))

    if (isLoading) return <ThoughtDetail content="Loading..." isLoading={true} />

    if (!data) return <ThoughtDetail content="Error getting latest thought." />

    const { thought } = data
    if (!thought) return <ThoughtDetail content="No thought found." />

    return <ThoughtDetail content={thought.content} />
}

export const ShowLatestThoughtCommand = withContext(ShowLatestThought)
