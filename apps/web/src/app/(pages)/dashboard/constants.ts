/**
 *
 */

import { ThoughtWithDatasets } from "./types"

export const mockThoughts: ThoughtWithDatasets[] = [
    {
        id: "thought-001",
        userId: "user-001",
        alias: "Product Vision",
        content: "ALTERED should be the shadcn/ui of data software - a solid, sensible base for managing thoughts in a database, but extendable via Dataset Schemas, Systems, and Interfaces.",
        datasets: ["ALTERED", "Vision"],
        validated: new Date("2024-01-15"),
        sensitive: false,
        archived: false,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-15")
    },
    {
        id: "thought-002",
        userId: "user-001",
        alias: "Tag Architecture",
        content: "Tags should be flat, not hierarchical. This reduces organizational overhead and allows finding content by starting with any tag.",
        datasets: ["ALTERED", "Architecture"],
        validated: null,
        sensitive: false,
        archived: false,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12")
    },
    {
        id: "thought-003",
        userId: "user-001",
        alias: null,
        content: "Consider fractional indexing for ordered collections - it allows inserting between items without reordering.",
        datasets: ["Engineering"],
        validated: new Date("2024-01-20"),
        sensitive: false,
        archived: false,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-20")
    },
    {
        id: "thought-004",
        userId: "user-001",
        alias: "Personal Note",
        content: "Remember to call mom on her birthday next week.",
        datasets: ["Personal"],
        validated: null,
        sensitive: true,
        archived: false,
        createdAt: new Date("2024-01-22"),
        updatedAt: new Date("2024-01-22")
    },
    {
        id: "thought-005",
        userId: "user-001",
        alias: "Old Feature Idea",
        content: "What if we added a calendar view? Maybe not the right priority now.",
        datasets: ["ALTERED", "Features"],
        validated: null,
        sensitive: false,
        archived: true,
        createdAt: new Date("2023-12-01"),
        updatedAt: new Date("2024-01-05")
    }
]
