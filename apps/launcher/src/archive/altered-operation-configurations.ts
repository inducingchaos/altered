// /**
//  *
//  */

// import { ALTEREDOperation } from "@altered/data/shapes"
// import { transformCaseOperation } from "./transform-case"

// export const modifyOperations = {
//     type: "group",
//     id: "modify",
//     name: "Modify",
//     operations: [transformCaseOperation]
// } satisfies ALTEREDOperation

/**
//  *
//  */

// import { ALTEREDOperation } from "@altered/data/shapes"

// export const transformCaseOperation = {
//     _predefined: true,
//     type: "operation",
//     id: "experimental-transform-case",
//     // Keypath syntax: inputs can reference interface data via $keypath
//     // Literal values are also supported
//     inputs: {
//         text: "$item.title", // Reference the current list item's title
//         case: "uppercase" // Literal enum value
//     },
//     // Outputs bind operation results back to interface data
//     outputs: {
//         result: "$item.title" // Overwrite the title with transformed result
//     },
//     activation: "manual", // Run when user clicks
//     visibility: "context-menu" // Show in action panel
// } satisfies ALTEREDOperation
