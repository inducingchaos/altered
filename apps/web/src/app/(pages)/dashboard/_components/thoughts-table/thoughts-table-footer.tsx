/**
 *
 */

import { Button, PaginationState, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, TanstackTable, Updater } from "./imports"

export function ThoughtsTableFooter<Thought>({ table, pagination, setPagination }: { table: TanstackTable<Thought>; pagination: PaginationState; setPagination: (updater: Updater<PaginationState>) => void }) {
    return (
        <div className="flex items-center justify-between">
            <ThoughtsTableRowSelectionCount table={table} />

            <div className="flex items-center gap-6">
                <ThoughtsTableRowCountSelector pagination={pagination} setPagination={setPagination} />

                <ThoughtsTablePageIndicator table={table} />

                <ThoughtsTablePageNavigation table={table} />
            </div>
        </div>
    )
}

export function ThoughtsTableRowSelectionCount<Thought>({ table }: { table: TanstackTable<Thought> }) {
    return (
        <div className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
    )
}

export function ThoughtsTableRowCountSelector({ pagination, setPagination }: { pagination: PaginationState; setPagination: (updater: Updater<PaginationState>) => void }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page</span>
            <Select value={String(pagination.pageSize)} onValueChange={value => setPagination(prev => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))}>
                <SelectTrigger className="w-18">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {[1, 2, 3, 5, 10, 20, 50].map(size => (
                        <SelectItem key={size} value={String(size)}>
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export function ThoughtsTablePageIndicator<Thought>({ table }: { table: TanstackTable<Thought> }) {
    return (
        <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
    )
}

export function ThoughtsTablePageNavigation<Thought>({ table }: { table: TanstackTable<Thought> }) {
    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
            </Button>
        </div>
    )
}
