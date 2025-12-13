/**
 *
 */

import { closeMainWindow, showToast, Toast } from "@raycast/api"
import { getAccessToken } from "@raycast/utils"
import { api } from "./lib/api"
import { withAuthentication } from "./lib/auth"
import { configureLogger } from "./lib/observability"

const logger = configureLogger({ defaults: { scope: "commands:get-latest-thought" } })

/**
 * @todo [P0] Investigate why authenticated "no-view" commands block on network responses. Ideally, we should execute the command and await on the the access token, showing a loading state or a toast in the meantime.
 */
async function getLatestThought() {
    logger.log()

    closeMainWindow()
    await showToast({ title: "Loading your thoughts...", style: Toast.Style.Animated })

    const { token: authToken } = getAccessToken()

    const { data, error } = await api.thoughts.getLatest({}, { context: { authToken } })
    if (error) return showToast({ title: "Error loading thoughts", style: Toast.Style.Failure })

    const { thought } = data
    if (!thought) return showToast({ title: "No thought found", style: Toast.Style.Failure })

    showToast({ title: thought.content, style: Toast.Style.Success })
}

export default withAuthentication(getLatestThought)
