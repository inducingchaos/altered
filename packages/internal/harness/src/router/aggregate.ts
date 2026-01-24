/**
 *
 */

import { DateTime } from "luxon"
import { clientRouteFactory } from "./factory"

export const aggregateRouter = {
    raycast: {
        menuBarText: clientRouteFactory.aggregate.raycast.menuBarText.handler(
            () => ({
                content: DateTime.now().toLocaleString(
                    DateTime.TIME_24_WITH_SECONDS
                )
            })
        )
    }
}
