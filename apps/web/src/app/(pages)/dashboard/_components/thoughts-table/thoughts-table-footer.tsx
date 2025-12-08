/**
 *
 */

import { IconChevronLeft, IconChevronRight } from "./icons"
import { Button, PaginationState, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, TanstackTable, Updater } from "./imports"

export function ThoughtsTableFooter<Thought>({ table, pagination, setPagination }: { table: TanstackTable<Thought>; pagination: PaginationState; setPagination: (updater: Updater<PaginationState>) => void }) {
    return (
        <div className="flex items-center justify-between h-12 px-3 border-t-2 border-foreground/12.5">
            <ThoughtsTableRowSelectionCount table={table} />

            <div className="flex items-center gap-4">
                <ThoughtsTableRowCountSelector pagination={pagination} setPagination={setPagination} />
                <ThoughtsTablePageIndicator table={table} />
                <ThoughtsTablePageNavigation table={table} />
            </div>
        </div>
    )
}

export function ThoughtsTableRowSelectionCount<Thought>({ table }: { table: TanstackTable<Thought> }) {
    return (
        <div className="text-foreground/40 text-xs font-px-grotesk-mono tracking-tighter">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected
        </div>
    )
}

export function ThoughtsTableRowCountSelector({ pagination, setPagination }: { pagination: PaginationState; setPagination: (updater: Updater<PaginationState>) => void }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-px-grotesk-mono tracking-tighter text-foreground/40">Rows</span>
            <Select value={String(pagination.pageSize)} onValueChange={value => setPagination(prev => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))}>
                <SelectTrigger className="w-14 h-7 rounded-none border-2 border-foreground/12.5 text-xs font-px-grotesk-mono tracking-tighter">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-foreground/12.5">
                    {[5, 10, 20, 50].map(size => (
                        <SelectItem key={size} value={String(size)} className="font-px-grotesk-mono tracking-tighter text-xs">
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
        <div className="text-xs font-px-grotesk-mono tracking-tighter text-foreground/40">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>
    )
}

export function ThoughtsTablePageNavigation<Thought>({ table }: { table: TanstackTable<Thought> }) {
    return (
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" className="rounded-none size-7" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <IconChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="rounded-none size-7" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <IconChevronRight className="size-4" />
            </Button>
        </div>
    )
}
