/**
 *
 */

import { TanstackTable, flexRender } from "./imports"

export function ThoughtsTableHeader<Thought>({ table }: { table: TanstackTable<Thought> }) {
    const headerGroups = table.getHeaderGroups()

    return (
        <thead className="border-b-2 border-foreground/12.5">
            {headerGroups.map(headerGroup => (
                <tr key={headerGroup.id} className="h-12">
                    {headerGroup.headers.map(header => (
                        <th key={header.id} className=" px-3 text-left align-middle font-bold text-foreground/37.5 font-px-grotesk-mono tracking-tighter text-xl uppercase">
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    )
}
