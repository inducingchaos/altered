/**
 *
 */

"use client"

import { Row } from "@tanstack/react-table"
import { Route } from "next"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/primitives/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/primitives/dropdown-menu"
import { ThoughtWithDatasets } from "../../_types"
import { IconEdit, IconExternalLink, IconMoreHorizontal, IconTrash } from "./icons"

interface RowActionsProps {
    row: Row<ThoughtWithDatasets>
}

export function RowActions({ row }: RowActionsProps) {
    const router = useRouter()
    const thought = row.original

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="rounded-none size-7">
                    <span className="sr-only">Open menu</span>
                    <IconMoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none border-2 border-foreground/12.5">
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${thought.id}` as Route)} className="font-px-grotesk-mono tracking-tighter text-xs">
                    <IconExternalLink className="size-4" />
                    Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${thought.id}?edit=true` as Route)} className="font-px-grotesk-mono tracking-tighter text-xs">
                    <IconEdit className="size-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive font-px-grotesk-mono tracking-tighter text-xs"
                    onClick={() => {
                        //  TODO [P1]: Implement delete functionality.
                        console.log("Delete thought:", thought.id)
                    }}
                >
                    <IconTrash className="size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
