/**
 *
 */

import { Action, Icon, popToRoot, showToast, Toast } from "@raycast/api"
import { logOut } from "~/lib/auth/oidc"

export async function LogOutAction() {
    const handleLogOut = async () => {
        await showToast({ style: Toast.Style.Animated, title: "Logging out..." })

        await logOut()

        await showToast({ style: Toast.Style.Success, title: "Successfully logged out" })
        await popToRoot({ clearSearchBar: true })
    }

    return <Action title="Log out" style={Action.Style.Destructive} icon={Icon.Logout} onAction={handleLogOut} />
}
