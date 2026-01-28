/**
 *
 */

import { clientRouteFactory } from "./factory"

export const aggregateRouter = {
    raycast: {
        menuBarText: clientRouteFactory.aggregate.raycast.menuBarText.handler(
            () => ({
                content: "Placeholder"
            })
        )
    }
}
