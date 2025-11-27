/**
 *
 */

"use client"
"use no memo"

import { ThoughtWithDatasets } from "../../_types"
import { ColumnVisibilityDropdownMenu } from "./column-visibility-dropdown-menu"
import { columns } from "./columns"
import { ColumnFiltersState, Input, RowSelectionState, SortingState, Table, ThoughtsTableProps, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, useState } from "./imports"
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
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <Input placeholder="Search thoughts..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} className="max-w-sm" />

                <ColumnVisibilityDropdownMenu table={table} />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <ThoughtsTableHeader table={table} />
                    <ThoughtsTableBody table={table} />
                </Table>
            </div>

            <ThoughtsTableFooter table={table} pagination={pagination} setPagination={setPagination} />
        </div>
    )
}

export function ThoughtsTable({ data }: { data: ThoughtWithDatasets[] }) {
    return <InternalThoughtsTable columns={columns} data={data} />
}
