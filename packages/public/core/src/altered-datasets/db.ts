/**
 * @todo [P4] Duplicate of types in @altered/data-shapes - resolve.
 */

import type { Thought } from "../altered-thoughts"
import type { Brand } from "../utils"

export type DatasetID = Brand<string, "Dataset ID">

export type Dataset = {
    id: DatasetID
    representingThoughtId: string
    createdAt: Date
}

export type CreatableDataset = Omit<Dataset, "createdAt"> & {
    id?: DatasetID
}

export type QueryableDataset = Pick<Dataset, "id">

export type DatasetWithThought = Dataset & {
    representingThought: Thought
}
