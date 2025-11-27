/**
 *
 */

import { TableBody, TableCell, TableRow, TanstackTable, flexRender } from "./imports"

export function ThoughtsTableBody<Thought>({ table }: { table: TanstackTable<Thought> }) {
    const rows = table.getRowModel().rows
    const columns = table.getAllColumns()

    return (
        <TableBody>
            {rows?.length ? (
                rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    )
}
