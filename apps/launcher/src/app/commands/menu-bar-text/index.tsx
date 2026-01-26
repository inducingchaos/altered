/**
 *
 */

import {
    Cache,
    environment,
    LaunchType,
    MenuBarExtra,
    updateCommandMetadata
} from "@raycast/api"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"
import { api } from "~/api/react"
import { withContext } from "~/shared/components"

const cache = new Cache()

type UseMenuBarTextResult = {
    isLoading: boolean

    /**
     * @remarks This can be integrated to show/hide the menu bar item.
     */
    shouldShow: true

    text: string | null
    cachedText: string | null
}

function useMenuBarText(options?: {
    onClick?: () => void

    showTextAsSubtitle?: boolean
}): UseMenuBarTextResult {
    const { onClick, showTextAsSubtitle = false } = options ?? {}

    const { isFetching, data, error } = useQuery(
        api.aggregate.raycast.menuBarText.queryOptions({ staleTime: 0 })
    )

    const cachedText = cache.get(environment.commandName) ?? null
    if (!showTextAsSubtitle || cachedText === null)
        updateCommandMetadata({ subtitle: null })

    useEffect(() => {
        if (environment.launchType === LaunchType.UserInitiated && onClick)
            onClick()
    }, [onClick])

    if (isFetching) {
        return {
            isLoading: true,
            shouldShow: true,

            text: null,
            cachedText
        }
    }

    if (!data) throw new Error("Error loading menu bar text.", { cause: error })

    cache.set(environment.commandName, data.content)
    if (showTextAsSubtitle) updateCommandMetadata({ subtitle: data.content })

    return {
        isLoading: false,
        shouldShow: true,

        text: data.content,
        cachedText: data.content
    }
}

/**
 * @remarks Menu bar items seem to behave very synchronously, where nothing is updated or reactive at all until the `isLoading` prop is set to false.
 *
 * This pretty much makes the visual loading state and cached result useless.
 *
 * Clicking the menu bar item before it's done loading immediately cancels the operation and unloads the command.
 *
 * The render tree is very fragile... rendering the `MenuBarExtra` component conditionally (e.g., before returning null) will cause the command to not be loaded at all.
 */
function MenuBarText() {
    const onClick = useCallback(() => {
        // launchCommand({
        //     name: "action-palette",
        //     type: LaunchType.UserInitiated,
        //     context: { launchedFrom: "menu-bar-text" }
        // })
    }, [])

    const { isLoading, shouldShow, text, cachedText } = useMenuBarText({
        onClick,

        showTextAsSubtitle: false
    })

    if (!shouldShow) return null

    return (
        <MenuBarExtra
            isLoading={isLoading}
            title={text ?? cachedText ?? "loading..."}
            tooltip="ALTERED Menu Bar Text"
        />
    )
}

export const MenuBarTextCommand = withContext(MenuBarText)
