/**
 *
 */

import { closeMainWindow, showToast, Toast } from "@raycast/api"
import { api } from "~/api"
import { isVersionIncompatibleError, showVersionIncompatibleError } from "~/api/utils"
import { authClient } from "~/auth"
import { configureLogger } from "~/observability"

const logger = configureLogger({ defaults: { scope: "commands:get-latest-thought" } })

export async function getLatestThoughtCommand() {
    logger.log()

    if (!(await authClient.isAuthed())) await authClient.authenticate()
    const authToken = await authClient.getToken()

    await showToast({ title: "Loading your thoughts...", style: Toast.Style.Animated })

    const { data, error } = await api.thoughts.getLatest({}, { context: { authToken } })

    if (error && isVersionIncompatibleError(error)) return await showVersionIncompatibleError()
    if (error) return await showToast({ title: "Error loading thoughts", style: Toast.Style.Failure })

    await closeMainWindow()

    const { thought } = data
    if (!thought) return await showToast({ title: "No thought found", style: Toast.Style.Failure })

    await showToast({ title: thought.content ?? "No content.", style: Toast.Style.Success })
}
