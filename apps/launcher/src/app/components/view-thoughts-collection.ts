/**
 *
 */

import type { ALTEREDComponent } from "@altered/core"
import { viewThoughtsGroupComponent } from "./view-thoughts-group"

export const viewThoughtsCollectionComponent = {
    id: "component-view-thoughts-collection",
    alias: "View Thoughts Collection Component",
    content: "An ALTERED collection Component for viewing thoughts.",

    type: "component",

    componentId: "collection",
    layout: "list",

    children: [viewThoughtsGroupComponent]
} satisfies ALTEREDComponent
