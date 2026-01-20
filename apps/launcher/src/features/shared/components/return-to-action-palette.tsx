/**
 *
 */

import { Action, Icon } from "@raycast/api"

export function ReturnToActionPaletteAction({
    resetNavigationState
}: {
    resetNavigationState: () => void
}) {
    return (
        <Action
            icon={Icon.ArrowLeftCircle}
            onAction={resetNavigationState}
            shortcut={{ modifiers: ["opt"], key: "escape" }}
            title="Return to Action Palette"
        />
    )
}
