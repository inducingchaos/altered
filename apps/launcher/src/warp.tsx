/**
 *
 */

import { Clipboard, closeMainWindow, getPreferenceValues, Toast } from "@raycast/api"

import { trpcClient } from "./utils/trpc"

export default async function Warp() {
    const toast = new Toast({
        style: Toast.Style.Animated,
        title: "Warping Thought"
    })

    const content = await Clipboard.readText()

    if (!content) {
        toast.style = Toast.Style.Failure
        toast.title = "No Content"
        toast.message = "No content to warp."

        toast.show()
        return
    }

    await closeMainWindow()
    await toast.show()

    const { "user-id": userId } = getPreferenceValues()

    try {
        await trpcClient.thoughts.create.mutate({ userId, content })

        toast.style = Toast.Style.Success
        toast.title = "Thought Warped: " + content.slice(0, 8) + (content.length > 8 ? "..." : "")
        toast.message = "Your thought has been warped."
    } catch (error) {
        toast.style = Toast.Style.Failure
        toast.title = "Error Warping Thought"
        toast.message = "Failed to warp your thought."

        console.error(error)
    }
}
