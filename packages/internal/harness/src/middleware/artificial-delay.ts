/**
 *
 */

import { type } from "arktype"
import { apiFactory } from "../factory"

export const artificialDelay = apiFactory.middleware(
    async ({ context, next, errors }) => {
        const delaySchema = type("string.numeric.parse").pipe(
            type("number >= 0")
        )

        const delay = context.request.headers.get("x-artificial-delay")
        if (delay === null) return next()

        const validatedDelay = delaySchema(delay)

        if (validatedDelay instanceof type.errors)
            throw errors.BAD_REQUEST({
                message: "Invalid artificial delay.",
                cause: { validationError: validatedDelay.summary }
            })

        if (validatedDelay > 0)
            await new Promise(resolve => setTimeout(resolve, validatedDelay))

        return next()
    }
)
