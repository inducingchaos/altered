/**
 *
 */

import type { Thought } from "@altered/core"
import { Action, ActionPanel, Icon } from "@raycast/api"
import { useAuthentication } from "~/auth"
import { LogOutAction, ReturnToActionPaletteAction } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import type { HandleDeleteThought, HandleUpdateThought } from "./shared"

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

    refreshThoughts: () => void
}

export function ThoughtListActions({
    thought,
    isShowingInspector,
    setIsShowingInspector,
    setIsCreatingThought,
    setEditingThoughtId,
    handleDeleteThought,
    refreshThoughts
}: ThoughtListActionsProps) {
    const { isAuthed } = useAuthentication()

    const actionPaletteContext = useActionPalette({ safe: true })

    return (
        <ActionPanel>
            <ActionPanel.Section title="View">
                {thought && (
                    <Action
                        icon={isShowingInspector ? Icon.EyeDisabled : Icon.Eye}
                        onAction={() => setIsShowingInspector(prev => !prev)}
                        shortcut={{ modifiers: ["cmd"], key: "i" }}
                        title={`${isShowingInspector ? "Hide" : "Open"} Inspector`}
                    />
                )}

                <Action
                    icon={Icon.RotateClockwise}
                    onAction={refreshThoughts}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                    title="Refresh Thoughts"
                />
            </ActionPanel.Section>

            <ActionPanel.Section title="Modify">
                <Action
                    icon={Icon.PlusCircle}
                    onAction={() => setIsCreatingThought(true)}
                    shortcut={{ modifiers: ["cmd"], key: "n" }}
                    title="Create Thought"
                />

                {thought && setEditingThoughtId && (
                    <Action
                        icon={Icon.Pencil}
                        onAction={() => setEditingThoughtId(thought.id)}
                        shortcut={{ modifiers: ["cmd"], key: "e" }}
                        title="Edit Thought"
                    />
                )}

                {thought && handleDeleteThought && (
                    <Action
                        icon={Icon.Trash}
                        onAction={() => handleDeleteThought(thought)}
                        shortcut={{ modifiers: ["shift"], key: "delete" }}
                        style={Action.Style.Destructive}
                        title="Delete Thought"
                    />
                )}

                {thought && handleDeleteThought && (
                    <Action
                        icon={Icon.Trash}
                        onAction={() =>
                            handleDeleteThought(thought, {
                                showConfirmation: false
                            })
                        }
                        shortcut={{
                            modifiers: ["shift", "cmd"],
                            key: "delete"
                        }}
                        style={Action.Style.Destructive}
                        title="Delete Without Confirmation"
                    />
                )}
            </ActionPanel.Section>

            <ActionPanel.Section title="Navigate">
                {actionPaletteContext && (
                    <ReturnToActionPaletteAction
                        resetNavigationState={actionPaletteContext.resetState}
                    />
                )}
            </ActionPanel.Section>

            <ActionPanel.Section title="Configure">
                {isAuthed && <LogOutAction />}
            </ActionPanel.Section>
        </ActionPanel>
    )
}
