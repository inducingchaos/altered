/**
 *
 */

import { ColumnDef } from "@tanstack/react-table"
import { Thought } from "~/server/data/schema"

export type ThoughtWithDatasets = Thought & {
    datasets: string[]
}

export type DataTableProps<Data, Value> = {
    columns: ColumnDef<Data, Value>[]
    data: Data[]
}
