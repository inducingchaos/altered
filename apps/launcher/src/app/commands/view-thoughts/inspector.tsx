/**
 *
 */

import type { Thought } from "@altered/core"
import { Color, Detail, List } from "@raycast/api"
import { memo, type ReactNode, useMemo } from "react"
import { formatDate } from "~/shared/utils"
import { sanitizeTextForMarkdown } from "./utils"

const detailMetadataNoContentPlaceholder = {
    value: "-",
    color: Color.SecondaryText
}

export const inspectorLayoutIds = [
    "compact",
    "balanced",
    "expanded",
    "full"
] as const

export type InspectorLayoutID = (typeof inspectorLayoutIds)[number]

const buildInspectorMarkdown = ({
    thought,
    layoutId
}: {
    thought: Thought
    layoutId: InspectorLayoutID
}): string => {
    if (!thought.alias && !thought.content) return "No content."

    const parts: string[] = []

    if (thought.alias) parts.push(`# ${thought.alias}`)
    if (thought.content) parts.push(sanitizeTextForMarkdown(thought.content))

    if (layoutId === "expanded" || layoutId === "full") {
        parts.push("## Attributes")

        const tableParts: string[] = []

        tableParts.push("| `Alias` | `Content` |")
        tableParts.push("| :---: | :---: |")

        const addedAt = formatDate(thought.addedAt, { preset: "a" })
        const createdAt = formatDate(thought.createdAt, { preset: "a" })
        const updatedAt = formatDate(thought.updatedAt, { preset: "a" })

        tableParts.push(`| \`Added At\` | \`${addedAt}\` |`)
        tableParts.push(`| \`Created At\` | \`${createdAt}\` |`)
        tableParts.push(`| \`Updated At\` | \`${updatedAt}\` |`)

        parts.push(tableParts.join("\n"))
    }

    return parts.join("\n\n")
}

export function createThoughtInspector({
    type
}: {
    type: "list-item-detail" | "detail"
}) {
    const Inspector = type === "list-item-detail" ? List.Item.Detail : Detail

    const CompactMetadataContent = memo(({ thought }: { thought: Thought }) => (
        <>
            <Inspector.Metadata.Label
                text={thought.alias ?? detailMetadataNoContentPlaceholder}
                title="Alias"
            />
            <Inspector.Metadata.Separator />

            <Inspector.Metadata.Label
                text={thought.content ?? detailMetadataNoContentPlaceholder}
                title="Content"
            />
            <Inspector.Metadata.Separator />
        </>
    ))

    const Metadata = memo(
        ({
            thought,
            layoutId
        }: {
            thought: Thought
            layoutId: InspectorLayoutID
        }) => (
            <Inspector.Metadata>
                {layoutId === "compact" && (
                    <CompactMetadataContent thought={thought} />
                )}

                <Inspector.Metadata.Label
                    text={{
                        value: formatDate(thought.addedAt, { preset: "b" }),
                        color: Color.SecondaryText
                    }}
                    title="Added"
                />
                <Inspector.Metadata.Separator />

                <Inspector.Metadata.Label
                    text={{
                        value: formatDate(thought.createdAt, { preset: "b" }),
                        color: Color.SecondaryText
                    }}
                    title="Created"
                />
                <Inspector.Metadata.Separator />

                <Inspector.Metadata.Label
                    text={{
                        value: formatDate(thought.updatedAt, { preset: "b" }),
                        color: Color.SecondaryText
                    }}
                    title="Updated"
                />
            </Inspector.Metadata>
        )
    )

    return ({
        thought,
        actions,
        layoutId
    }: {
        thought: Thought
        actions?: ReactNode
        layoutId: InspectorLayoutID
    }) => {
        const markdown = useMemo(
            () =>
                layoutId === "balanced" ||
                layoutId === "expanded" ||
                layoutId === "full"
                    ? buildInspectorMarkdown({ thought, layoutId })
                    : undefined,
            [thought, layoutId]
        )

        return (
            <Inspector
                actions={actions}
                markdown={markdown}
                metadata={
                    layoutId === "compact" || layoutId === "balanced" ? (
                        <Metadata layoutId={layoutId} thought={thought} />
                    ) : undefined
                }
            />
        )
    }
}

export const ThoughtInspectorListDetail = createThoughtInspector({
    type: "list-item-detail"
})
export const ThoughtInspectorDetail = createThoughtInspector({ type: "detail" })
