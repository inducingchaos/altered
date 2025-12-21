/**
 *
 */

import { Action, Icon, closeMainWindow, PopToRootType } from "@raycast/api"

export function DismissAction() {
    return <Action title="Dismiss" icon={Icon.XMarkTopRightSquare} onAction={() => closeMainWindow({ clearRootSearch: true, popToRootType: PopToRootType.Immediate })} shortcut={{ modifiers: ["opt"], key: "escape" }} />
}
