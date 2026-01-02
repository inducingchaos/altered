/**
 * @todo [P3] Move to a `custom` or `components` folder, since this is a React Interface (view component), not a command.
 */

import type { MutableThought, QueryableThought, Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Form, Icon } from "@raycast/api"
import { useForm } from "@raycast/utils"
import { LogOutAction, ReturnToActionPaletteAction } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"

export function EditThought({ thought, pop, onUpdateThought }: { thought: Thought; pop: () => void; onUpdateThought: ({ where, values }: { where: QueryableThought; values: MutableThought }) => Promise<void> }) {
    const actionPaletteContext = useActionPalette({ safe: true })

    const { itemProps, handleSubmit } = useForm<{
        content: string
        alias: string
    }>({
        onSubmit: async formValues => {
            await onUpdateThought({
                where: { id: thought.id },
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
            <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} icon={Icon.CheckCircle} />

            <ActionPanel.Section title="Navigate">
                <Action title="Cancel Edit" onAction={pop} shortcut={{ modifiers: ["cmd"], key: "e" }} icon={Icon.XMarkCircle} />

                {actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}
            </ActionPanel.Section>

            <ActionPanel.Section title="Configure">
                <LogOutAction />
            </ActionPanel.Section>
        </ActionPanel>
    )

    return (
        <Form actions={createActions()} navigationTitle="Edit Thought">
            <Form.TextField title="Alias" info="An arbitrary name/title for the Thought." {...itemProps.alias} />

            <Form.TextArea title="Content" autoFocus info="The content of your thought." {...itemProps.content} />
        </Form>
    )
}
