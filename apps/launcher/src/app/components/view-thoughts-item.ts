/**
 *
 */

import type { ALTEREDComponent } from "@altered/core"
import { Icon } from "@raycast/api"
import { viewThoughtsMetadataComponent } from "./view-thoughts-metadata"

export const viewThoughtsItemComponent = {
    id: "component-view-thoughts-item",
    alias: "View Thoughts Item Component",
    content: "An ALTERED collection item Component for viewing Thoughts.",

    type: "component",

    componentId: "collection-item",
    icon: Icon.LightBulb,
    title: "[TEST] Item Title",
    subtitle: "[TEST] Item Subtitle",

    children: [viewThoughtsMetadataComponent]
} satisfies ALTEREDComponent
