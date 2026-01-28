/**
 * @todo [P4] Duplicate of mocks in @altered/data-shapes - resolve.
 */

import { mockComponent } from "../altered-components"
import type { ALTEREDInterface } from "./meta"

export const mockInterface = {
    id: "interface-mock",
    alias: "Mock Interface",
    content: "An ALTERED Interface mock.",

    type: "interface",

    components: [mockComponent]
} satisfies ALTEREDInterface
