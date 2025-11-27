/**
 *
 */

import { ColumnDef } from "@tanstack/react-table"
import { Thought } from "~/server/data/schema"

export type ThoughtWithDatasets = Thought & {
    datasets: string[]
}

export type ThoughtsTableProps<Thought, Value> = {
    columns: ColumnDef<Thought, Value>[]
    data: Thought[]
}
