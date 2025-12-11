/**
 *
 */

import { ActionPanel, Detail } from "@raycast/api"
import { useQuery } from "@tanstack/react-query"
import { LogOutAction } from "~/components/actions"
import { withContext } from "~/components/providers"
import { api } from "~/lib/api"
import { withAuthentication } from "~/lib/auth"

function GlobalActionPanel() {
    return (
        <ActionPanel>
            <LogOutAction />
        </ActionPanel>
    )
}

const ThoughtDetail = ({ content }: { content: string }) => {
    return <Detail markdown={content} actions={<GlobalActionPanel />} />
}

function ShowLatestThought() {
    const { data: queryData, error: queryError, isLoading } = useQuery(api.thoughts.getLatest.queryOptions())

    if (isLoading) return <ThoughtDetail content="Loading..." />

    if (!queryData) {
        console.error(queryError)

        return <ThoughtDetail content="Network error." />
    }

    const { data: apiData, error: apiError } = queryData
    if (!apiData) {
        console.error(apiError)

        return <ThoughtDetail content="API error." />
    }

    const { thought } = apiData
    if (!thought) {
        return <ThoughtDetail content="No thought found." />
    }

    return <ThoughtDetail content={thought.content} />
}

export default withAuthentication(withContext(ShowLatestThought))
