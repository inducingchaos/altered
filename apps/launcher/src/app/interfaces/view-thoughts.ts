/**
 *
 */

import type { ALTEREDInterface } from "@altered/core"
import { viewThoughtsCollectionComponent } from "app/components"

/**
 * @todo [P2] Add refresh/delete operations that interact with state on the Action level (as it will be used within the "Edit Thought" interface later).
 */
export const viewThoughtsInterface = {
    id: "interface-view-thoughts",
    alias: "View Thoughts Interface",
    content: "An ALTERED Interface for the View Thoughts Action.",

    type: "interface",

    components: [viewThoughtsCollectionComponent]
} satisfies ALTEREDInterface
