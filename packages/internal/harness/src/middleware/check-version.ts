/**
 *
 */

import { apiFactory } from "../factory"
import { checkVersionCompatibility } from "../utils"

/**
 * @remarks We no longer require a client version to be passed, since external clients may not set such a header value. The version is more to reinforce the stability of our trusted clients, rather than restrict API usage to them - so this behaviour should be fine.
 */
export const checkVersion = apiFactory.middleware(
    async ({ context, next, errors }) => {
        const clientVersion = context.request.headers.get("x-client-version")
        if (!clientVersion) return next()

        /**
         * @todo [P2] Get server version from config or environment variable.
         */
        const serverVersion = "0.1.0"

        if (!checkVersionCompatibility(clientVersion, serverVersion)) {
            throw errors.VERSION_INCOMPATIBLE({
                message: `Client version (${clientVersion}) is incompatible with server version (${serverVersion}). Please update the extension.`
            })
        }

        return next()
    }
)
