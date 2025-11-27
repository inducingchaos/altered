/**
 *
 */

import { TableHead, TableHeader, TableRow, TanstackTable, flexRender } from "./imports"

export function ThoughtsTableHeader<Thought>({ table }: { table: TanstackTable<Thought> }) {
    const headerGroups = table.getHeaderGroups()

    return (
        <TableHeader>
            {headerGroups.map(headerGroup => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                    ))}
                </TableRow>
            ))}
        </TableHeader>
    )
}
