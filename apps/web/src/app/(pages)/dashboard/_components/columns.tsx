/**
 *
 */

"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { DateTime } from "luxon"
import { ThoughtWithDatasets } from "../types"

export const AliasColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const alias = row.getValue("alias") as string | null
    return <span className="text-muted-foreground">{alias ?? "—"}</span>
}

export const ContentColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const content = row.getValue("content") as string
    const truncated = content.length > 80 ? content.slice(0, 80) + "..." : content
    return <span className="max-w-md">{truncated}</span>
}

export const DatasetsColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const datasets = row.getValue("datasets") as string[]
    return (
        <div className="flex gap-1 flex-wrap">
            {datasets.map(dataset => (
                <span key={dataset} className="px-2 py-0.5 text-xs bg-muted rounded-md">
                    {dataset}
                </span>
            ))}
        </div>
    )
}

export const CreatedAtColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const date = row.getValue("createdAt") as Date
    return <span className="text-muted-foreground">{DateTime.fromJSDate(date).toFormat("MMM d, yyyy")}</span>
}

export const UpdatedAtColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const date = row.getValue("updatedAt") as Date
    return <span className="text-muted-foreground">{DateTime.fromJSDate(date).toFormat("MMM d, yyyy")}</span>
}

export const columns: ColumnDef<ThoughtWithDatasets>[] = [
    {
        accessorKey: "alias",
        header: "Alias",
        cell: AliasColumnCell
    },
    {
        accessorKey: "content",
        header: "Content",
        cell: ContentColumnCell
    },
    {
        accessorKey: "datasets",
        header: "Datasets",
        cell: DatasetsColumnCell
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: CreatedAtColumnCell
    },
    {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: UpdatedAtColumnCell
    }
]
