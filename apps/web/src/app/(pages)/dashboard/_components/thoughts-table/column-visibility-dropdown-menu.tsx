/**
 *
 */

import { IconSliders } from "./icons"
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, TanstackTable } from "./imports"

export function ColumnVisibilityDropdownMenu<Thought>({ table }: { table: TanstackTable<Thought> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-none h-7 font-px-grotesk-mono tracking-tighter text-xs text-foreground/40">
                    <IconSliders className="size-4" />
                    Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none border-2 border-foreground/12.5">
                {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => (
                        <DropdownMenuCheckboxItem key={column.id} className="capitalize font-px-grotesk-mono tracking-tighter text-xs" checked={column.getIsVisible()} onCheckedChange={value => column.toggleVisibility(!!value)}>
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
