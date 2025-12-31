/**
 *
 */

import { Action, ActionPanel, closeMainWindow, Form, Icon, List, popToRoot, PopToRootType, showToast, Toast } from "@raycast/api"
import { useAuthentication } from "~/auth"
import { configureLogger } from "~/observability"
import { LogOutAction, ReturnToActionPaletteAction, withContext } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"

const logger = configureLogger({ defaults: { scope: "commands:capture-thought" } })

/**
 * @todo [P2] Keeping as list for now because it allows us to use `EmptyView`, but we could change this to a detail/form (or similar). Should be generic for use with other commands.
 */
function AuthView() {
    const { isLoading, authenticate } = useAuthentication()

    const actionPaletteContext = useActionPalette({ safe: true })

    return (
        <List
            isLoading={isLoading}
            actions={
                <ActionPanel>
                    {isLoading ? null : <Action title="Authenticate" onAction={authenticate} />}

                    {actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}
                </ActionPanel>
            }
            searchBarPlaceholder=""
        >
            {isLoading ? null : <List.EmptyView title="Authenticate to capture your thoughts." icon={Icon.Lock} description="Sign in to access your ALTERED Brain." />}
        </List>
    )
}

function ThoughtForm({ pop, shouldCloseOnSubmit = true }: { pop?: () => void; shouldCloseOnSubmit?: boolean }) {
    const actionPaletteContext = useActionPalette({ safe: true })

    const createActions = () => (
        <ActionPanel>
            <Action.SubmitForm
                title="Capture"
                onSubmit={async () => {
                    if (shouldCloseOnSubmit) await closeMainWindow({ clearRootSearch: false, popToRootType: PopToRootType.Suspended })

                    await showToast({
                        style: Toast.Style.Animated,
                        title: "Creating Thought..."
                    })

                    if (pop) pop()
                    else if (actionPaletteContext) actionPaletteContext.resetState()

                    setTimeout(async () => {
                        await showToast({
                            style: Toast.Style.Success,
                            title: "Thought Created"
                        })

                        if (!actionPaletteContext && !pop) popToRoot({ clearSearchBar: true })
                    }, 3000)
                }}
                icon={Icon.Maximize}
            />

            <ActionPanel.Section title="Navigate">{actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}</ActionPanel.Section>

            <ActionPanel.Section title="Configure">
                <LogOutAction />
            </ActionPanel.Section>
        </ActionPanel>
    )

    return (
        <Form actions={createActions()} navigationTitle="Capture Thought">
            <Form.TextArea id="content" title="Thought" autoFocus info="The content of your thought." />
        </Form>
    )
}

export function CaptureThought(props: { pop?: () => void; shouldCloseOnSubmit?: boolean }) {
    logger.log()

    const { isAuthed } = useAuthentication()
    if (!isAuthed) return <AuthView />

    return <ThoughtForm {...props} />
}

export const CaptureThoughtCommand = withContext(CaptureThought)
