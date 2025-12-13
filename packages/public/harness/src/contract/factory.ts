/**
 *
 */

import { oc } from "@orpc/contract"

/**
 * @todo [P3] Move errors to an error layer.
 */
export const contractFactory = oc.errors({
    UNAUTHORIZED: {
        status: 401
    },
    BAD_REQUEST: {
        status: 400
    },
    INTERNAL_SERVER_ERROR: {
        status: 500
    }
})
