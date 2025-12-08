/**
 *
 */

"use client"

import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "~/components/ui/primitives/button"
import { cn } from "~/utils/ui"

interface ColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    title: string
    className?: string
}

export function ColumnHeader<TData, TValue>({ column, title, className }: ColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    const sorted = column.getIsSorted()

    return (
        <Button variant="ghost" size="sm" className={cn("-ml-3 h-8", className)} onClick={() => column.toggleSorting(sorted === "asc")}>
            {title}
            {sorted === "asc" ? <ArrowUp className="ml-2 size-4" /> : sorted === "desc" ? <ArrowDown className="ml-2 size-4" /> : <ArrowUpDown className="ml-2 size-4" />}
        </Button>
    )
}
