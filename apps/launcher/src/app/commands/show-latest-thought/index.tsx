/**
 *
 */

import { Action, ActionPanel, Detail } from "@raycast/api"
import { useQuery } from "@tanstack/react-query"
import { api } from "~/api/react"
import {
    isVersionIncompatibleError,
    VersionIncompatibleError
} from "~/api/utils"
import { useAuthentication } from "~/auth"
import { configureLogger } from "~/observability"
import { LogOutAction, withContext } from "~/shared/components"

const logger = configureLogger({
    defaults: { scope: "commands:show-latest-thought" }
})

function ShowLatestThought() {
    logger.log()

    const { isLoading, isAuthed, token, authenticate } = useAuthentication()

    if (isLoading) return <Detail isLoading={true} />

    if (!isAuthed)
        return (
            <Detail
                actions={
                    <ActionPanel>
                        <Action
                            onAction={authenticate}
                            title={"Authenticate"}
                        />
                    </ActionPanel>
                }
                markdown="Welcome! Please authenticate to continue."
            />
        )

    return <LatestThoughtView authToken={token} />
}

const ThoughtDetail = ({
    content,
    isLoading
}: {
    content: string
    isLoading?: boolean
}) => {
    return (
        <Detail
            actions={
                <ActionPanel>
                    <LogOutAction />
                </ActionPanel>
            }
            isLoading={isLoading}
            markdown={content}
        />
    )
}

export function LatestThoughtView({ authToken }: { authToken: string | null }) {
    const { data, isLoading, error } = useQuery(
        api.thoughts.getLatest.queryOptions({ context: { authToken } })
    )

    if (isLoading)
        return <ThoughtDetail content="Loading..." isLoading={true} />

    if (error && isVersionIncompatibleError(error))
        return <VersionIncompatibleError />
    if (!data) return <ThoughtDetail content="Error getting latest thought." />

    const { thought } = data
    if (!thought) return <ThoughtDetail content="No thought found." />

    return <ThoughtDetail content={thought.content ?? "No content."} />
}

export const ShowLatestThoughtCommand = withContext(ShowLatestThought)
