/**
 *
 */

import { Action, ActionPanel, Icon, List } from "@raycast/api"
import { useActionPalette } from "app/commands/action-palette/state"
import { useAuthentication } from "~/auth"
import { ReturnToActionPaletteAction } from "./return-to-action-palette"

export function AuthView(props?: { title?: string; description?: string }) {
    const {
        title = "Authenticate to Continue",
        description = "Sign in to access your ALTERED Brain."
    } = props ?? {}

    const actionPaletteContext = useActionPalette({ safe: true })

    const { isLoading, authenticate } = useAuthentication()

    return (
        <List
            actions={
                <ActionPanel>
                    {!isLoading && (
                        <Action onAction={authenticate} title="Authenticate" />
                    )}

                    <ActionPanel.Section title="Navigate">
                        {actionPaletteContext && (
                            <ReturnToActionPaletteAction
                                resetNavigationState={
                                    actionPaletteContext.resetState
                                }
                            />
                        )}
                    </ActionPanel.Section>
                </ActionPanel>
            }
            isLoading={isLoading}
            searchBarPlaceholder=""
        >
            {!isLoading && (
                <List.EmptyView
                    description={description}
                    icon={Icon.Lock}
                    title={title}
                />
            )}
        </List>
    )
}
