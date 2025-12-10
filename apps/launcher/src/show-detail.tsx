/**
 *
 */

import { ActionPanel, Detail } from "@raycast/api"
import { getAccessToken } from "@raycast/utils"
import { useEffect, useState } from "react"
import { withAuthentication } from "~/lib/auth"
import { LogoutAction } from "./actions"
import { getUserInfo, OAuthUserInfo } from "./lib/auth/oidc"

const createMarkdown = (userInfo: OAuthUserInfo) => {
    return `
# ALTERED - Show Detail

## Authenticated User

- **Name**: ${userInfo.name ?? "N/A"}
- **Email**: ${userInfo.email ?? "N/A"}
- **User ID**: ${userInfo.sub ?? "N/A"}
`
}

function ShowDetailCommand() {
    const { token } = getAccessToken()

    const [isLoading, setIsLoading] = useState(true)
    const [userInfo, setUserInfo] = useState<OAuthUserInfo | null>(null)

    useEffect(() => {
        getUserInfo(token)
            .then(setUserInfo)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [token])

    if (isLoading || !userInfo) return <Detail markdown="Loading..." />

    return (
        <Detail
            markdown={createMarkdown(userInfo)}
            actions={
                <ActionPanel>
                    <LogoutAction />
                </ActionPanel>
            }
        />
    )
}

export default withAuthentication(ShowDetailCommand)
