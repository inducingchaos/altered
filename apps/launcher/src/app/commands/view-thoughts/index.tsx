/**
 *
 */

import { ActionPanel, Detail } from "@raycast/api"
import { ReturnToActionPaletteAction } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"

export function ViewThoughtsCommand() {
    const { resetState } = useActionPalette()

    return (
        <Detail
            markdown="# View Thoughts"
            actions={
                <ActionPanel>
                    <ReturnToActionPaletteAction resetNavigationState={resetState} />
                </ActionPanel>
            }
        />
    )
}
