/**
 *
 */

import { Action, ActionPanel, Icon } from "@raycast/api"

import { Thought } from "@altered/db/schema"

export function GlobalActions({
    thought,
    refreshThoughts,
    deleteThought,
    isShowingDetail,
    toggleDetail
}: {
    thought: Thought
    refreshThoughts: () => Promise<unknown>
    deleteThought: (thought: Thought) => void
    isShowingDetail: boolean
    toggleDetail: () => void
}) {
    return (
        <ActionPanel>
            <ActionPanel.Section title="View">
                <Action
                    title={isShowingDetail ? "Hide Inspector" : "Inspect"}
                    icon={isShowingDetail ? Icon.EyeDisabled : Icon.Eye}
                    shortcut={{ modifiers: ["cmd"], key: "i" }}
                    onAction={toggleDetail}
                />
            </ActionPanel.Section>

            <ActionPanel.Section title="Modify">
                <Action
                    title="Refresh"
                    icon={Icon.RotateClockwise}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                    onAction={refreshThoughts}
                />
                <Action
                    title="Delete"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                    onAction={() => deleteThought(thought)}
                />
            </ActionPanel.Section>
        </ActionPanel>
    )
}
