/**
 *
 */

import type { ALTEREDComponent } from "@altered/data/shapes"
import { viewThoughtsItemComponent } from "./view-thoughts-item"

export const viewThoughtsGroupComponent = {
    id: "component-view-thoughts-group",
    alias: "View Thoughts Group Component",
    content: "An ALTERED collection group Component for viewing Thoughts.",

    type: "component",

    componentId: "collection-group",
    title: "[TEST] Group Title",
    subtitle: "[TEST] Group Subtitle",

    children: [viewThoughtsItemComponent]
} satisfies ALTEREDComponent
