// /**
//  *
//  */

// import { OperationID } from "@altered/data/shapes"
// import { closeMainWindow, PopToRootType } from "@raycast/api"
// import { nanoid } from "nanoid"
// import { OperationAdapterContext } from "./operations-context"

// /**
//  * Input definition for operation registry.
//  */
// export type OperationRegistryInput = {
//     id: string
//     name: string
//     description: string
//     type: "text" | "number" | "boolean" | "enum"
//     options?: string[] // For enum type
//     required?: boolean
//     defaultValue?: unknown
// }

// /**
//  * Output definition for operation registry.
//  */
// export type OperationRegistryOutput = {
//     id: string
//     name: string
//     description: string
//     type: "text" | "number" | "boolean"
// }

// /**
//  * Operation handler context with resolved inputs.
//  */
// export type OperationHandlerContext = OperationAdapterContext & {
//     /**
//      * Resolved input values (keypaths resolved, defaults applied).
//      */
//     inputs: Record<string, unknown>

//     /**
//      * Interface context data (for keypath resolution).
//      */
//     interfaceContext?: Record<string, unknown>
// }

// /**
//  * Operation handler function.
//  */
// export type OperationHandler = (context: OperationHandlerContext) => unknown

// /**
//  * Operation registry entry.
//  */
// export type OperationRegistryEntry = {
//     id: OperationID
//     name: string
//     description: string
//     inputs?: OperationRegistryInput[]
//     outputs?: OperationRegistryOutput[]
//     handler: OperationHandler
// }

// /**
//  * Registry of all available operations.
//  */
// export const operationHandlers: Record<OperationID, OperationRegistryEntry> = {
//     "dismiss-action": {
//         id: "dismiss-action",
//         name: "Dismiss",
//         description: "Close the current interface.",
//         handler: () => {
//             closeMainWindow({ clearRootSearch: true, popToRootType: PopToRootType.Immediate })
//         }
//     },
//     "return-to-action-palette": {
//         id: "return-to-action-palette",
//         name: "Return to Action Palette",
//         description: "Return to the Action Palette.",
//         handler: ctx => {
//             ctx.state.reset()
//         }
//     },
//     "experimental-transform-case": {
//         id: "experimental-transform-case",
//         name: "Transform Text Case",
//         description: "Transform the case of text.",
//         inputs: [
//             {
//                 id: "text",
//                 name: "Text",
//                 description: "The text to transform.",
//                 type: "text",
//                 required: true
//             },
//             {
//                 id: "case",
//                 name: "Case",
//                 description: "The case to transform to.",
//                 type: "enum",
//                 options: ["uppercase", "lowercase", "title"],
//                 required: true
//             }
//         ],
//         outputs: [
//             {
//                 id: "result",
//                 name: "Result",
//                 description: "The transformed text.",
//                 type: "text"
//             }
//         ],
//         handler: ctx => {
//             const text = String(ctx.inputs.text || "")
//             const caseType = String(ctx.inputs.case || "uppercase")

//             let result: string
//             switch (caseType) {
//                 case "uppercase":
//                     result = text.toUpperCase()
//                     break
//                 case "lowercase":
//                     result = text.toLowerCase()
//                     break
//                 case "title":
//                     result = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
//                     break
//                 default:
//                     result = text
//             }

//             return { result }
//         }
//     },
//     "internal-log": {
//         id: "internal-log",
//         name: "Internal Log",
//         description: "Log a value internally (for debugging).",
//         inputs: [
//             {
//                 id: "value",
//                 name: "Value",
//                 description: "The value to log.",
//                 type: "text"
//             }
//         ],
//         handler: ctx => {
//             console.log("[Internal Log]", ctx.inputs.value)
//         }
//     },
//     "add-thought": {
//         id: "add-thought",
//         name: "Add Thought",
//         description: "Create a new thought with a random ID and title.",
//         outputs: [
//             {
//                 id: "thoughtId",
//                 name: "Thought ID",
//                 description: "The ID of the created thought.",
//                 type: "text"
//             }
//         ],
//         handler: ctx => {
//             const thoughtId = nanoid()
//             const randomNumber = Math.floor(Math.random() * 999) + 1
//             const title = `Thought ${randomNumber}`

//             // Store thought in state if state store is available
//             if (ctx.interfaceContext && typeof ctx.interfaceContext === "object") {
//                 const interfaceState = ctx.interfaceContext as Record<string, unknown>
//                 if (!interfaceState.thoughts) {
//                     interfaceState.thoughts = []
//                 }
//                 if (Array.isArray(interfaceState.thoughts)) {
//                     interfaceState.thoughts.push({ id: thoughtId, title })
//                 }
//             }

//             return { thoughtId }
//         }
//     },
//     "delete-item": {
//         id: "delete-item",
//         name: "Delete Item",
//         description: "Remove an item at the specified keypath from state.",
//         inputs: [
//             {
//                 id: "keypath",
//                 name: "Keypath",
//                 description: "The keypath to the item to delete (e.g., $items[0]).",
//                 type: "text",
//                 required: true
//             }
//         ],
//         handler: ctx => {
//             const keypath = String(ctx.inputs.keypath || "")
//             if (!keypath.startsWith("$")) {
//                 console.warn("delete-item: keypath must start with $")
//                 return
//             }

//             // Delete from state store if available
//             if (ctx.interfaceContext && typeof ctx.interfaceContext === "object") {
//                 // The actual deletion will be handled by the adapter using the store
//                 return { deleted: true, keypath }
//             }
//         }
//     },
//     "delete-all-items": {
//         id: "delete-all-items",
//         name: "Delete All Items",
//         description: "Remove all items from an array at the specified keypath.",
//         inputs: [
//             {
//                 id: "keypath",
//                 name: "Keypath",
//                 description: "The keypath to the array to clear (e.g., $items).",
//                 type: "text",
//                 required: true
//             }
//         ],
//         handler: ctx => {
//             const keypath = String(ctx.inputs.keypath || "")
//             if (!keypath.startsWith("$")) {
//                 console.warn("delete-all-items: keypath must start with $")
//                 return
//             }

//             // Clear array in state store if available
//             if (ctx.interfaceContext && typeof ctx.interfaceContext === "object") {
//                 // The actual clearing will be handled by the adapter using the store
//                 return { cleared: true, keypath }
//             }
//         }
//     },
//     "push-interface": {
//         id: "push-interface",
//         name: "Push Interface",
//         description: "Navigate to an interface by index.",
//         inputs: [
//             {
//                 id: "index",
//                 name: "Interface Index",
//                 description: "The index of the interface to navigate to.",
//                 type: "number",
//                 required: true
//             }
//         ],
//         handler: ctx => {
//             const index = Number(ctx.inputs.index)
//             // Navigation will be handled by the adapter
//             return { navigateTo: index, action: "push" }
//         }
//     },
//     "pop-interface": {
//         id: "pop-interface",
//         name: "Pop Interface",
//         description: "Navigate back to the previous interface.",
//         handler: () => {
//             // Navigation will be handled by the adapter
//             return { action: "pop" }
//         }
//     },
//     "replace-interface": {
//         id: "replace-interface",
//         name: "Replace Interface",
//         description: "Replace the current interface with another by index.",
//         inputs: [
//             {
//                 id: "index",
//                 name: "Interface Index",
//                 description: "The index of the interface to replace with.",
//                 type: "number",
//                 required: true
//             }
//         ],
//         handler: ctx => {
//             const index = Number(ctx.inputs.index)
//             // Navigation will be handled by the adapter
//             return { navigateTo: index, action: "replace" }
//         }
//     }
// }
