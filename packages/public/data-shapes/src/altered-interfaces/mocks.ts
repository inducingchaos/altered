/**
 *
 */

import { mockComponent } from "../altered-components"
import { ALTEREDInterface } from "./meta"

export const mockInterface = {
    id: "interface-mock",
    alias: "Mock Interface",
    content: "An ALTERED Interface mock.",

    type: "interface",

    components: [mockComponent]
} satisfies ALTEREDInterface
