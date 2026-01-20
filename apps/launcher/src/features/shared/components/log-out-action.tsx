/**
 *
 */

import { Action, Icon, popToRoot, showToast, Toast } from "@raycast/api"
import { logOut } from "../../auth/oidc"

export function LogOutAction() {
    const handleLogOut = async () => {
        await showToast({
            style: Toast.Style.Animated,
            title: "Logging out..."
        })

        await logOut()

        await showToast({
            style: Toast.Style.Success,
            title: "Successfully logged out"
        })
        await popToRoot({ clearSearchBar: true })
    }

    return (
        <Action
            icon={Icon.Logout}
            onAction={handleLogOut}
            shortcut={{ modifiers: ["cmd", "shift"], key: "l" }}
            style={Action.Style.Destructive}
            title="Log out"
        />
    )
}
