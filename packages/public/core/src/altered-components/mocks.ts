/**
 * @todo [P4] Duplicate of mocks in @altered/data-shapes - resolve.
 */

import type { ALTEREDComponent } from "./meta"

export const mockComponent = {
    id: "component-mock",
    alias: "Mock Component",
    content: "An ALTERED Component mock.",

    type: "component",

    componentId: "markdown",
    componentContent: "# Mock Component"
} satisfies ALTEREDComponent
