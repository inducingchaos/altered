/**
 *
 */

import { Action, closeMainWindow, Icon, PopToRootType } from "@raycast/api"

export function DismissAction() {
    return (
        <Action
            icon={Icon.XMarkTopRightSquare}
            onAction={() =>
                closeMainWindow({
                    clearRootSearch: true,
                    popToRootType: PopToRootType.Immediate
                })
            }
            shortcut={{ modifiers: ["opt"], key: "escape" }}
            title="Dismiss"
        />
    )
}
