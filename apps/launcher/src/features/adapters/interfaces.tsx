/**
 *
 */

import { ALTEREDInterface } from "@altered/data/shapes"
import { Detail } from "@raycast/api"

type InterfaceAdapterOptions = {
    platform?: "raycast" | "web"
}

const defaultOptions: InterfaceAdapterOptions = {
    platform: "web"
}

const fallbackMarkdown = `
# Error

Component-based interfaces are not yet implemented.
`

export function createInterfaceAdapter(interfaces: ALTEREDInterface[], options?: InterfaceAdapterOptions) {
    const { platform } = {
        ...defaultOptions,
        ...options
    }

    if (platform !== "raycast") throw new Error(`The '${platform}' platform is currently not supported.`)

    if (interfaces.length === 0) throw new Error("At least one interface must be provided.")

    for (const alteredInterface of interfaces) {
        if (alteredInterface.custom === true) return alteredInterface.react()

        //  TODO: Render defined Interfaces here.
    }

    //  REMARKS: Temporary fallback for everything else. All cases should be handled before this.

    return <Detail markdown={fallbackMarkdown} />
}
