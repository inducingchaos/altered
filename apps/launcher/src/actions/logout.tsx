/**
 *
 */

import { Action, Icon, popToRoot, showToast, Toast } from "@raycast/api"
import { createPKCEClient } from "~/lib/auth/oidc"
import { revokeTokens } from "~/lib/auth/oidc/revoke"

export function LogoutAction() {
    return (
        <Action
            title="Log out"
            style={Action.Style.Destructive}
            icon={Icon.Logout}
            onAction={async () => {
                const client = createPKCEClient()
                const tokenSet = await client.getTokens()

                if (tokenSet?.accessToken || tokenSet?.refreshToken) {
                    try {
                        const tokenTypeHint = tokenSet.accessToken ? "access_token" : "refresh_token"
                        const token = tokenSet.accessToken ?? tokenSet.refreshToken

                        await revokeTokens(token, tokenTypeHint)
                    } catch (error) {
                        console.error("Failed to revoke tokens:", error)
                    }
                }

                await client.removeTokens()

                await showToast({ style: Toast.Style.Success, title: "Logged out" })

                await popToRoot({ clearSearchBar: true })
            }}
        />
    )
}
