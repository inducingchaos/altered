/**
 * @todo [P3] Extract to error layer or data shapes.
 */

import { AnySchema, ErrorMap, ErrorMapItem, MergedErrorMap, oc } from "@orpc/contract"

export const apiErrorDefs = {
    VERSION_INCOMPATIBLE: {
        status: 412,
        message: "Version Incompatible"
    }
} as const

export type APIErrorCode = keyof typeof apiErrorDefs
export type APIErrorMap = MergedErrorMap<ErrorMap, { [key in APIErrorCode]?: ErrorMapItem<AnySchema> }>

export const apiErrorCodes = Object.fromEntries(Object.entries(apiErrorDefs).map(([key]) => [key, key])) as Record<APIErrorCode, APIErrorCode>

export const contractFactory = oc.errors({
    UNAUTHORIZED: {
        status: 401
    },
    BAD_REQUEST: {
        status: 400
    },
    INTERNAL_SERVER_ERROR: {
        status: 500
    },

    VERSION_INCOMPATIBLE: {
        status: 412
    }
} satisfies APIErrorMap)
