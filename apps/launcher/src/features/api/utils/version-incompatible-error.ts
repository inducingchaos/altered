/**
 *
 */

import { APIError } from "@altered/harness"
import { isDefinedError } from "@orpc/client"
import { popToRoot, showToast, Toast } from "@raycast/api"
import { useEffect } from "react"

export function isVersionIncompatibleError(error: APIError): error is APIError & { code: "VERSION_INCOMPATIBLE" } {
    return isDefinedError(error) && error.code === "VERSION_INCOMPATIBLE"
}

/**
 * @remarks Previously, we tried wrapping our oRPC Tanstack Query client and vanilla API client with custom functionality to check and handle this on every request. We then reverted to adding a custom interceptor to our RPC link, which was simpler and also worked. However, I believe these were the wrong abstractions - we should expose this error handling logic within the scope of the API call itself (in a component or function), rather than directly coupling `popToRoot` to a failed data request. Alternatively, we could group this logic with other error handling logic.
 */
export async function showVersionIncompatibleError() {
    await showToast({
        style: Toast.Style.Failure,
        title: "Version Incompatible",
        message: "This ALTERED app is out of date. Please update it to the latest version."
    })

    await popToRoot({ clearSearchBar: true })
}

export function VersionIncompatibleError() {
    useEffect(() => void showVersionIncompatibleError(), [])

    return null
}
