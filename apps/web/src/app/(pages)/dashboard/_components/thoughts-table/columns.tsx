/**
 *
 */

"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { DateTime } from "luxon"
import { Checkbox } from "~/components/ui/primitives/checkbox"
import { ThoughtWithDatasets } from "../../_types"
import { ColumnHeader } from "./column-header"
import { RowActions } from "./row-actions"

export const AliasColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const alias = row.getValue("alias") as string | null
    return <span className="text-foreground/37.5 font-px-grotesk tracking-tight text-sm">{alias ?? "—"}</span>
}

export const ContentColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const content = row.getValue("content") as string
    return (
        <div className="relative max-w-md overflow-hidden">
            <span className="font-px-grotesk font-normal text-foreground/87.5 text-sm whitespace-nowrap">{content}</span>
            {/* Gradient fade for overflow */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-background to-transparent pointer-events-none" />
        </div>
    )
}

export const DatasetsColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const datasets = row.getValue("datasets") as string[]
    return (
        <div className="flex gap-2 flex-wrap">
            {datasets.map(dataset => (
                <span key={dataset} className="px-2 py-1 text-xs font-px-grotesk-mono tracking-tighter text-foreground/37.5 bg-foreground/3.25  border-foreground/12.5">
                    {dataset}
                </span>
            ))}
        </div>
    )
}

export const CreatedAtColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const date = row.getValue("createdAt") as Date
    return <span className="text-foreground/37.5 font-px-grotesk tracking-tight text-sm">{DateTime.fromJSDate(date).toFormat("MMM d, yyyy")}</span>
}

export const UpdatedAtColumnCell = ({ row }: { row: Row<ThoughtWithDatasets> }) => {
    const date = row.getValue("updatedAt") as Date
    return <span className="text-foreground/37.5 font-px-grotesk tracking-tight text-sm">{DateTime.fromJSDate(date).toFormat("MMM d, yyyy")}</span>
}

export const columns: ColumnDef<ThoughtWithDatasets>[] = [
    {
        id: "select",
        header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" className="rounded-none border-2 border-foreground/12.5" />,
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" className="rounded-none border-2 border-foreground/12.5" />,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "alias",
        header: ({ column }) => <ColumnHeader column={column} title="Alias" type="text" />,
        cell: AliasColumnCell
    },
    {
        accessorKey: "content",
        header: ({ column }) => <ColumnHeader column={column} title="Content" type="text" />,
        cell: ContentColumnCell
    },
    {
        accessorKey: "datasets",
        header: ({ column }) => <ColumnHeader column={column} title="Datasets" type="tags" />,
        cell: DatasetsColumnCell,
        enableSorting: false
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <ColumnHeader column={column} title="Created" type="date" />,
        cell: CreatedAtColumnCell
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => <ColumnHeader column={column} title="Updated" type="date" />,
        cell: UpdatedAtColumnCell
    },
    {
        id: "actions",
        cell: ({ row }) => <RowActions row={row} />,
        enableSorting: false,
        enableHiding: false
    }
]
