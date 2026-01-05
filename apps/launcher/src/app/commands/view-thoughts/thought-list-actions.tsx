/**
 *
 */

import { Thought } from "@altered/data/shapes"
import { Action, ActionPanel, Icon } from "@raycast/api"
import { useAuthentication } from "~/auth"
import { LogOutAction, ReturnToActionPaletteAction } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import { HandleDeleteThought, HandleUpdateThought } from "./shared"

/**
 * @remarks Could use improvement (when we finalize `ThoughtList`), good enough for now.
 */
export type ThoughtListActionsProps = {
    thought?: Thought

    isShowingInspector: boolean
    setIsShowingInspector: (setState: (prevState: boolean) => boolean) => void

    setIsCreatingThought: (newState: boolean) => void

    /**
     * @remarks Could we normalize to be more like update/delete?
     */
    setEditingThoughtId?: (newState: string | null) => void

    handleUpdateThought?: HandleUpdateThought
    handleDeleteThought?: HandleDeleteThought
}

export function ThoughtListActions({ thought, isShowingInspector, setIsShowingInspector, setIsCreatingThought, setEditingThoughtId, handleDeleteThought }: ThoughtListActionsProps) {
    const { isAuthed } = useAuthentication()

    const actionPaletteContext = useActionPalette({ safe: true })

    return (
        <ActionPanel>
            <ActionPanel.Section title="View">{thought && <Action title={`${isShowingInspector ? "Hide" : "Open"} Inspector`} onAction={() => setIsShowingInspector(prev => !prev)} shortcut={{ modifiers: ["cmd"], key: "i" }} icon={isShowingInspector ? Icon.EyeDisabled : Icon.Eye} />}</ActionPanel.Section>

            <ActionPanel.Section title="Modify">
                <Action title="Create Thought" onAction={() => setIsCreatingThought(true)} shortcut={{ modifiers: ["cmd"], key: "n" }} icon={Icon.PlusCircle} />

                {thought && setEditingThoughtId && <Action title="Edit Thought" onAction={() => setEditingThoughtId(thought.id)} shortcut={{ modifiers: ["cmd"], key: "e" }} icon={Icon.Pencil} />}

                {thought && handleDeleteThought && <Action title="Delete Thought" onAction={() => handleDeleteThought(thought)} shortcut={{ modifiers: ["shift"], key: "delete" }} icon={Icon.Trash} style={Action.Style.Destructive} />}

                {thought && handleDeleteThought && <Action title="Delete Without Confirmation" onAction={() => handleDeleteThought(thought, { showConfirmation: false })} shortcut={{ modifiers: ["shift", "cmd"], key: "delete" }} icon={Icon.Trash} style={Action.Style.Destructive} />}
            </ActionPanel.Section>

            <ActionPanel.Section title="Navigate">{actionPaletteContext && <ReturnToActionPaletteAction resetNavigationState={actionPaletteContext.resetState} />}</ActionPanel.Section>

            <ActionPanel.Section title="Configure">{isAuthed && <LogOutAction />}</ActionPanel.Section>
        </ActionPanel>
    )
}
