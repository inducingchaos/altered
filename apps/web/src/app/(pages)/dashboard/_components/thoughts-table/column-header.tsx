/**
 *
 */

"use client"

import { Column } from "@tanstack/react-table"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "~/components/ui/primitives/context-menu"
import { cn } from "~/utils/ui"
import { IconArrowDown, IconArrowUp, IconInfo } from "./icons"

interface ColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    title: string
    type?: string
    className?: string
}

export function ColumnHeader<TData, TValue>({ column, title, type = "text", className }: ColumnHeaderProps<TData, TValue>) {
    const canSort = column.getCanSort()
    const sorted = column.getIsSorted()

    const handleSchemaInfo = () => {
        //  TODO [P2]: Open Schema Info modal/drawer.
        console.log("Open Schema Info for column:", column.id)
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <button type="button" className={cn("flex items-center gap-2 -ml-1 px-1 py-0.5 text-left cursor-pointer hover:bg-foreground/4 transition-colors", sorted && "text-foreground/60", className)} onClick={handleSchemaInfo}>
                    <span className="font-px-grotesk-mono tracking-tighter font-bold text-sm uppercase">{title}</span>
                    <span className="text-[10px] text-foreground/30 font-px-grotesk-mono tracking-tighter">{type}</span>
                    {sorted === "asc" && <IconArrowUp className="size-3 ml-auto" />}
                    {sorted === "desc" && <IconArrowDown className="size-3 ml-auto" />}
                </button>
            </ContextMenuTrigger>
            <ContextMenuContent className="rounded-none border-2 border-foreground/12.5">
                <ContextMenuItem onClick={handleSchemaInfo} className="font-px-grotesk-mono tracking-tighter text-xs">
                    <IconInfo className="size-4" />
                    Schema Info
                </ContextMenuItem>
                {canSort && (
                    <>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => column.toggleSorting(false)} className="font-px-grotesk-mono tracking-tighter text-xs">
                            <IconArrowUp className="size-4" />
                            Sort Ascending
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => column.toggleSorting(true)} className="font-px-grotesk-mono tracking-tighter text-xs">
                            <IconArrowDown className="size-4" />
                            Sort Descending
                        </ContextMenuItem>
                        {sorted && (
                            <ContextMenuItem onClick={() => column.clearSorting()} className="font-px-grotesk-mono tracking-tighter text-xs text-foreground/50">
                                Clear Sort
                            </ContextMenuItem>
                        )}
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}
