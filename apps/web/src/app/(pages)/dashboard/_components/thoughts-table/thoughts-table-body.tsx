/**
 *
 */

import { ColumnDef } from "@tanstack/react-table"
import { TanstackTable, flexRender } from "./imports"

export function ThoughtsTableBody<Thought, Value>({ table, columns }: { table: TanstackTable<Thought>; columns: ColumnDef<Thought, Value>[] }) {
    const rows = table.getRowModel().rows

    return (
        <tbody>
            {rows?.length ? (
                rows.map(row => (
                    <tr key={row.id} className="h-12 border-b-2 border-foreground/12.5 last:border-b-0 hover:bg-foreground/2 data-[state=selected]:bg-foreground/4" data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="h-12 px-3 align-middle">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={columns.length} className="h-24 text-center text-foreground/40 font-px-grotesk-mono tracking-tighter">
                        No results.
                    </td>
                </tr>
            )}
        </tbody>
    )
}
