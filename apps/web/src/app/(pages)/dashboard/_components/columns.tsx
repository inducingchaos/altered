/**
 *
 */

"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { DateTime } from "luxon"
import { Checkbox } from "~/components/ui/primitives/checkbox"
import { ThoughtWithDatasets } from "../_types"
import { ColumnHeader } from "./thoughts-table/column-header"
import { RowActions } from "./thoughts-table/row-actions"

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
        id: "select",
        header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "alias",
        header: ({ column }) => <ColumnHeader column={column} title="Alias" />,
        cell: AliasColumnCell
    },
    {
        accessorKey: "content",
        header: ({ column }) => <ColumnHeader column={column} title="Content" />,
        cell: ContentColumnCell
    },
    {
        accessorKey: "datasets",
        header: "Datasets",
        cell: DatasetsColumnCell,
        enableSorting: false
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <ColumnHeader column={column} title="Created" />,
        cell: CreatedAtColumnCell
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => <ColumnHeader column={column} title="Updated" />,
        cell: UpdatedAtColumnCell
    },
    {
        id: "actions",
        cell: ({ row }) => <RowActions row={row} />,
        enableSorting: false,
        enableHiding: false
    }
]
