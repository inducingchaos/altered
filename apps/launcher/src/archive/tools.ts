// /**
//  *
//  */

// import { Color, Icon } from "@raycast/api"

// import { Thought } from "@altered/db/schema"

// export type Tool = {
//     id: string
//     name: string
//     description: string
//     icon: Icon
//     color?: Color

//     /**
//      * The type of data that the tool accepts (from the current selection, or to be selected).
//      *
//      * @todo [P3] Expand to include Datasets, Systems, Schemas, (selected) text, etc.
//      *
//      * @remarks Could rename to `dataType` or `type`.
//      */
//     inputType: Thought | null
//     outputType: Thought | null

//     /**
//      * @remarks Could include `modify`, `generate`, `submit`, `delete`, `import`, etc.
//      */
//     operation: "create" | "read" | "update" | "delete"

//     keywords?: ToolCategory[]
//     action: () => void
// }

// export type ToolCategory = "Capture" | "Organization" | "AI" | "Settings"
