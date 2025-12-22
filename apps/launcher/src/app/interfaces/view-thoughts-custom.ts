/**
 *
 */

import { ALTEREDInterface } from "@altered/data/shapes"
import { ViewThoughtsCommand } from "app/commands/view-thoughts"

export const viewThoughtsCustomInterface = {
    id: "interface-view-thoughts-custom",
    alias: "View Thoughts Custom Interface",
    content: "An ALTERED custom Interface for the View Thoughts Action.",

    type: "interface",
    custom: true,

    react: ViewThoughtsCommand
} satisfies ALTEREDInterface
