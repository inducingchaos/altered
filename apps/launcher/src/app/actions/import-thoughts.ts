/**
 *
 */

import type { ALTEREDAction } from "@altered/data/shapes"
import { Icon } from "@raycast/api"
import { importThoughtsCustomInterface } from "app/interfaces"

export const importThoughtsAction = {
    id: "action-import-thoughts",
    alias: "Import Thoughts Action",
    content: "An ALTERED Action for importing Thoughts from text documents.",

    type: "action",

    icon: Icon.Upload,
    name: "Import Thoughts",
    title: "Import your Thoughts",
    description: "Import Thoughts from documents on your computer.",

    interfaces: [importThoughtsCustomInterface]
} satisfies ALTEREDAction
