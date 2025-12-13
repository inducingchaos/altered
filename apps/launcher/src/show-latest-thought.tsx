/**
 *
 */

import { ActionPanel, Detail } from "@raycast/api"
import { getAccessToken } from "@raycast/utils"
import { useQuery } from "@tanstack/react-query"
import { LogOutAction } from "~/components/actions"
import { withContext } from "~/components/providers"
import { withAuthentication } from "~/lib/auth"
import { queryApi } from "./lib/api"
import { configureLogger } from "./lib/observability"

const logger = configureLogger({ defaults: { scope: "commands:show-latest-thought" } })

function ThoughtDetailActionPanel() {
    return (
        <ActionPanel>
            <LogOutAction />
        </ActionPanel>
    )
}

const ThoughtDetail = ({ content }: { content: string }) => {
    return <Detail markdown={content} actions={<ThoughtDetailActionPanel />} />
}

function ShowLatestThought() {
    logger.log()

    const { token: authToken } = getAccessToken()

    const { data, error, isLoading } = useQuery(queryApi.thoughts.getLatest.queryOptions({ context: { authToken } }))

    if (isLoading) return <ThoughtDetail content="Loading..." />

    if (!data) {
        console.error(error)

        return <ThoughtDetail content="Network error." />
    }

    const { thought } = data
    if (!thought) {
        return <ThoughtDetail content="No thought found." />
    }

    return <ThoughtDetail content={thought.content} />
}

export default withAuthentication(withContext(ShowLatestThought))
