/**
 *
 */

import { Action, ActionPanel, Icon } from "@raycast/api"

import { Thought } from "@altered/db/schema"

export function ThoughtListItemActions({
    thought,
    handleRefresh,
    handleDelete,
    isShowingDetail,
    toggleDetail
}: {
    thought: Thought
    handleRefresh: () => unknown
    handleDelete: (thought: Thought) => unknown
    isShowingDetail: boolean
    toggleDetail: () => unknown
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
                    onAction={handleRefresh}
                />
                <Action
                    title="Delete"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                    onAction={() => handleDelete(thought)}
                />
            </ActionPanel.Section>
        </ActionPanel>
    )
}
