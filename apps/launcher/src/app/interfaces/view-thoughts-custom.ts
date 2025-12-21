/**
 *
 */

import { ALTEREDInterface } from "@altered/data/shapes"
import { ViewThoughtsCommand } from "app/commands/view-thoughts"

export const viewThoughtsInterface = {
    id: "interface-view-thoughts",
    alias: "View Thoughts Interface",
    content: "An ALTERED Interface for the View Thoughts Action.",

    type: "interface",
    custom: true,

    react: ViewThoughtsCommand
} satisfies ALTEREDInterface
