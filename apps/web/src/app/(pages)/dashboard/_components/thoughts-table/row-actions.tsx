/**
 *
 */

"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/primitives/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/primitives/dropdown-menu"
import { ThoughtWithDatasets } from "../../_types"
import { Route } from "next"

interface RowActionsProps {
    row: Row<ThoughtWithDatasets>
}

export function RowActions({ row }: RowActionsProps) {
    const router = useRouter()
    const thought = row.original

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${thought.id}` as Route)}>
                    <ExternalLink className="size-4" />
                    Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${thought.id}?edit=true` as Route)}>
                    <Pencil className="size-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                        //  TODO [P1]: Implement delete functionality.
                        console.log("Delete thought:", thought.id)
                    }}
                >
                    <Trash className="size-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
