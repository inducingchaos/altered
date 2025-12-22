/**
 *
 */

import { Action } from "@altered/data/shapes"
import { Icon } from "@raycast/api"
import { viewThoughtsCustomInterface } from "app/interfaces"

export const viewThoughtsAction = {
    id: "action-view-thoughts",
    alias: "View Thoughts Action",
    content: "An ALTERED Action for viewing your thoughts.",

    type: "action",

    icon: Icon.List,
    name: "View Thoughts",
    title: "View your Thoughts",
    description: "View and manage the thoughts in your ALTERED Brain.",

    trigger: "v",

    interfaces: [viewThoughtsCustomInterface]
} satisfies Action
