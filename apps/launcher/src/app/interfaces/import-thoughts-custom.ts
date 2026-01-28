/**
 *
 */

import type { ALTEREDInterface } from "@altered/core"
import { ImportThoughts } from "app/commands/import-thoughts"

export const importThoughtsCustomInterface = {
    id: "interface-import-thoughts-custom",
    alias: "Import Thoughts Custom Interface",
    content: "An ALTERED custom Interface for the Import Thoughts Action.",

    type: "interface",
    custom: true,

    react: ImportThoughts
} satisfies ALTEREDInterface
