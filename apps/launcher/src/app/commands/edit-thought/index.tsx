/**
 * @todo [P3] Move to a `custom` or `components` folder, since this is a React Interface (view component), not a command.
 */

import type { Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Form, Icon } from "@raycast/api"
import { useForm } from "@raycast/utils"
import { LogOutAction, ReturnToActionPaletteAction } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import type { HandleUpdateThought } from "../view-thoughts/shared"

export function EditThought({
    thought,
    pop,
    onUpdateThought
}: {
    thought: Thought
    pop: () => void
    onUpdateThought: HandleUpdateThought
}) {
    const actionPaletteContext = useActionPalette({ safe: true })

    const { itemProps, handleSubmit } = useForm<{
        content: string
        alias: string
    }>({
        onSubmit: formValues => {
            onUpdateThought({
                query: { id: thought.id },
                values: formValues
            })

            pop()
        },

        initialValues: {
            content: thought.content ?? "",
            alias: thought.alias ?? ""
        }
    })

    const createActions = () => (
        <ActionPanel>
            <Action.SubmitForm
                icon={Icon.CheckCircle}
                onSubmit={handleSubmit}
                title="Save Changes"
            />

            <ActionPanel.Section title="Navigate">
                <Action
                    icon={Icon.XMarkCircle}
                    onAction={pop}
                    shortcut={{ modifiers: ["cmd"], key: "e" }}
                    title="Cancel Edit"
                />

                {actionPaletteContext && (
                    <ReturnToActionPaletteAction
                        resetNavigationState={actionPaletteContext.resetState}
                    />
                )}
            </ActionPanel.Section>

            <ActionPanel.Section title="Configure">
                <LogOutAction />
            </ActionPanel.Section>
        </ActionPanel>
    )

    return (
        <Form actions={createActions()} navigationTitle="Edit Thought">
            <Form.TextField
                info="An arbitrary name/title for the Thought."
                title="Alias"
                {...itemProps.alias}
            />

            <Form.TextArea
                autoFocus
                info="The content of your thought."
                title="Content"
                {...itemProps.content}
            />
        </Form>
    )
}
