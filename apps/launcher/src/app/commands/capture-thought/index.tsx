/**
 *
 */

import { CreatableThought } from "@altered/data/shapes"
import { Action, ActionPanel, closeMainWindow, Form, Icon, List, popToRoot, PopToRootType, showToast, Toast } from "@raycast/api"
import { FormValidation, useForm } from "@raycast/utils"
import { nanoid } from "nanoid"
import { api } from "~/api"
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

type ThoughtFormProps = {
    authToken: string
    pop?: () => void
    shouldCloseOnSubmit?: boolean
    onCreateThought?: (thought: CreatableThought) => void
}

function ThoughtForm({ authToken, pop, shouldCloseOnSubmit = true, onCreateThought }: ThoughtFormProps) {
    const actionPaletteContext = useActionPalette({ safe: true })

    const { handleSubmit, itemProps } = useForm<{
        content: string
    }>({
        onSubmit: async formValues => {
            if (shouldCloseOnSubmit) await closeMainWindow({ clearRootSearch: false, popToRootType: PopToRootType.Suspended })

            if (pop) pop()
            else if (actionPaletteContext) actionPaletteContext.resetState()

            const thoughtInput = { id: nanoid(), alias: null, content: formValues.content }

            if (onCreateThought) {
                onCreateThought(thoughtInput)
            } else {
                await showToast({
                    style: Toast.Style.Animated,
                    title: "Creating Thought..."
                })

                const { error } = await api.thoughts.create(thoughtInput, { context: { authToken } })

                if (error) {
                    logger.error({ title: "Failed to Create Thought", description: error.message, data: { cause: error.cause } })

                    await showToast({
                        style: Toast.Style.Failure,
                        title: "Failed to Create Thought",
                        message: "Please try again later."
                    })

                    return
                }

                await showToast({
                    style: Toast.Style.Success,
                    title: "Thought Created"
                })

                if (!actionPaletteContext && !pop) popToRoot({ clearSearchBar: true })
            }
        },

        validation: {
            content: FormValidation.Required
        }
    })

    const createActions = () => (
        <ActionPanel>
            <Action.SubmitForm title="Capture" onSubmit={handleSubmit} icon={Icon.Maximize} />

            <ActionPanel.Section title="Navigate">{actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}</ActionPanel.Section>

            <ActionPanel.Section title="Configure">
                <LogOutAction />
            </ActionPanel.Section>
        </ActionPanel>
    )

    return (
        <Form actions={createActions()} navigationTitle="Capture Thought">
            <Form.TextArea title="Thought" autoFocus info="The content of your thought." {...itemProps.content} />
        </Form>
    )
}

type CaptureThoughtProps = {
    pop?: () => void
    shouldCloseOnSubmit?: boolean
    onCreateThought?: (thought: CreatableThought) => void
}

export function CaptureThought(props: CaptureThoughtProps) {
    logger.log()

    const { isAuthed, token } = useAuthentication()
    if (!isAuthed) return <AuthView />

    return <ThoughtForm authToken={token} {...props} />
}

export const CaptureThoughtCommand = withContext(CaptureThought)
