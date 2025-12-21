/**
 *
 */

import { closeMainWindow, showToast, Toast } from "@raycast/api"
import { api } from "~/api"
import { authClient } from "~/auth/client"
import { configureLogger } from "~/observability"

const logger = configureLogger({ defaults: { scope: "commands:get-latest-thought" } })

export async function getLatestThoughtCommand() {
    logger.log()

    if (!(await authClient.isAuthed())) await authClient.authenticate()
    const authToken = await authClient.getToken()

    await closeMainWindow()
    await showToast({ title: "Loading your thoughts...", style: Toast.Style.Animated })

    const { data, error } = await api.thoughts.getLatest({}, { context: { authToken } })
    if (error) return await showToast({ title: "Error loading thoughts", style: Toast.Style.Failure })

    const { thought } = data
    if (!thought) return await showToast({ title: "No thought found", style: Toast.Style.Failure })

    await showToast({ title: thought.content, style: Toast.Style.Success })
}
