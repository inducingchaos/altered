/**
 *
 */

import { Action, ActionPanel, Icon, List } from "@raycast/api"
import { useActionPalette } from "app/commands/action-palette/state"
import { useAuthentication } from "~/auth"
import { ReturnToActionPaletteAction } from "./return-to-action-palette"

export function AuthView(props?: { title?: string; description?: string }) {
    const { title = "Authenticate to Continue", description = "Sign in to access your ALTERED Brain." } = props ?? {}

    const actionPaletteContext = useActionPalette({ safe: true })

    const { isLoading, authenticate } = useAuthentication()

    return (
        <List
            isLoading={isLoading}
            actions={
                <ActionPanel>
                    {!isLoading && <Action title="Authenticate" onAction={authenticate} />}

                    <ActionPanel.Section title="Navigate">{actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}</ActionPanel.Section>
                </ActionPanel>
            }
            searchBarPlaceholder=""
        >
            {!isLoading && <List.EmptyView title={title} icon={Icon.Lock} description={description} />}
        </List>
    )
}
