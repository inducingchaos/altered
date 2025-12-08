/**
 *
 */

"use client"
"use no memo"

import { ThoughtWithDatasets } from "../../_types"
import { ColumnVisibilityDropdownMenu } from "./column-visibility-dropdown-menu"
import { columns } from "./columns"
import { IconSearch } from "./icons"
import { ColumnFiltersState, Input, RowSelectionState, SortingState, ThoughtsTableProps, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, useState } from "./imports"
import { ThoughtsTableBody } from "./thoughts-table-body"
import { ThoughtsTableFooter } from "./thoughts-table-footer"
import { ThoughtsTableHeader } from "./thoughts-table-header"

export function InternalThoughtsTable<Thought, Value>({ columns, data }: ThoughtsTableProps<Thought, Value>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    /**
     * @remarks Tanstack Table hooks are currently incompatible with React 19 - "use no memo" directive works for now.
     *
     * @todo [P3]: Review in future.
     */
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
            rowSelection,
            pagination
        }
    })

    return (
        <div className="w-full border-2 border-foreground/12.5">
            {/* Toolbar row - integrated into table */}
            <div className="flex items-center justify-between h-12 px-3 border-b-2 border-foreground/12.5">
                <div className="flex items-center gap-2">
                    <IconSearch className="size-4 text-foreground/40" />
                    <Input placeholder="Search thoughts..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} className="max-w-sm h-8 border-0 rounded-none bg-transparent shadow-none focus-visible:ring-0 px-0 font-px-grotesk-mono tracking-tighter text-sm" />
                </div>

                <ColumnVisibilityDropdownMenu table={table} />
            </div>

            {/* Table content */}
            <table className="w-full caption-bottom text-sm">
                <ThoughtsTableHeader table={table} />
                <ThoughtsTableBody table={table} columns={columns} />
            </table>

            {/* Footer row - integrated into table */}
            <ThoughtsTableFooter table={table} pagination={pagination} setPagination={setPagination} />
        </div>
    )
}

export function ThoughtsTable({ data }: { data: ThoughtWithDatasets[] }) {
    return <InternalThoughtsTable columns={columns} data={data} />
}
