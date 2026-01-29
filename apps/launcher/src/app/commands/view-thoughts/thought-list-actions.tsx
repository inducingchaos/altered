/**
 *
 */

import type { Thought } from "@altered/core"
import { Action, ActionPanel, Icon } from "@raycast/api"
import { useAuthentication } from "~/auth"
import { LogOutAction, ReturnToActionPaletteAction } from "~/shared/components"
import { useActionPalette } from "../action-palette/state"
import { type InspectorLayoutID, inspectorLayoutIds } from "./inspector"
import type { HandleDeleteThought, HandleUpdateThought } from "./shared"

/**
 * @remarks Could use improvement (when we finalize `ThoughtList`), good enough for now.
 */
export type ThoughtListActionsProps = {
    thought?: Thought

    isShowingInspector: boolean
    setIsShowingInspector: (newState: boolean) => void
    inspectorLayoutId: InspectorLayoutID
    setInspectorLayoutId: (newState: InspectorLayoutID) => void

    setIsCreatingThought: (newState: boolean) => void

    /**
     * @remarks Could we normalize to be more like update/delete?
     */
    setEditingThoughtId?: (newState: string | null) => void

    handleUpdateThought?: HandleUpdateThought
    handleDeleteThought?: HandleDeleteThought

    refreshThoughts: () => void

    selectNextThought: () => void
    selectPreviousThought: () => void
}

export function ThoughtListActions({
    thought,

    isShowingInspector,
    setIsShowingInspector,
    inspectorLayoutId,
    setInspectorLayoutId,

    setIsCreatingThought,

    setEditingThoughtId,

    handleDeleteThought,

    refreshThoughts,

    selectNextThought,
    selectPreviousThought
}: ThoughtListActionsProps) {
    const { isAuthed } = useAuthentication()

    const actionPaletteContext = useActionPalette({ safe: true })

    return (
        <ActionPanel>
            <ActionPanel.Section title="View">
                {thought && (
                    <Action
                        icon={isShowingInspector ? Icon.EyeDisabled : Icon.Eye}
                        onAction={() =>
                            setIsShowingInspector(
                                isShowingInspector ? false : true
                            )
                        }
                        shortcut={{ modifiers: ["cmd"], key: "i" }}
                        title={`${isShowingInspector ? "Hide" : "Show"} Inspector`}
                    />
                )}

                {thought && isShowingInspector && (
                    <Action
                        icon={Icon.AppWindowSidebarRight}
                        onAction={() => {
                            const currentLayoutIndex =
                                inspectorLayoutIds.indexOf(inspectorLayoutId)

                            const nextLayout = inspectorLayoutIds[
                                (currentLayoutIndex + 1) %
                                    inspectorLayoutIds.length
                            ] as InspectorLayoutID

                            setInspectorLayoutId(nextLayout)
                        }}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "i" }}
                        title={"Toggle Inspector Layout"}
                    />
                )}

                {thought && (
                    <Action
                        icon={Icon.ArrowDown}
                        onAction={selectNextThought}
                        shortcut={{ modifiers: [], key: "tab" }}
                        title={"Select Next Thought"}
                    />
                )}

                {thought && (
                    <Action
                        icon={Icon.ArrowUp}
                        onAction={selectPreviousThought}
                        shortcut={{ modifiers: ["shift"], key: "tab" }}
                        title={"Select Previous Thought"}
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
