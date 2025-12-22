/**
 *
 */

import { ALTEREDComponent } from "@altered/data/shapes"
import { Icon } from "@raycast/api"

export const viewThoughtsMetadataComponent = {
    id: "component-view-thoughts-metadata",
    alias: "View Thoughts Metadata Component",
    content: "An ALTERED collection item metadata Component for viewing Thoughts.",

    type: "component",

    componentId: "collection-item-metadata",
    icon: Icon.Emoji,
    text: "[TEST] Metadata Text",
    tooltip: "[TEST] Metadata Tooltip"
} satisfies ALTEREDComponent
