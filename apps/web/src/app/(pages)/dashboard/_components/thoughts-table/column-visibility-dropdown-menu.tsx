/**
 *
 */

import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, Settings2, TanstackTable } from "./imports"

export function ColumnVisibilityDropdownMenu<Thought>({ table }: { table: TanstackTable<Thought> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings2 className="size-4" />
                    Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => (
                        <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={value => column.toggleVisibility(!!value)}>
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
