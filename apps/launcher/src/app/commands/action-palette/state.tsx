/**
 *
 */

import { filterSystems } from "@altered/client/utils"
import type { ALTEREDAction, ALTEREDSystem } from "@altered/core"
import { clearSearchBar } from "@raycast/api"
// biome-ignore lint/performance/noNamespaceImport: Used for dynamic access to exports.
import * as staticSystems from "app/systems"
import { createContext, type ReactNode, use, useState } from "react"

type ActionPaletteContextValue = {
    isLoading: boolean

    searchText: string
    setSearchText: (text: string) => void
    onSearchTextChange: (searchText: string) => void
    selectedItemId: string | null
    setSelectedItemId: (id: string | null) => void

    selectedActionId: string | null
    setSelectedActionId: (id: string | null) => void
    renderedActionId: string | null

    systems: ALTEREDSystem[]
    filteredSystems: ALTEREDSystem[]
    selectedAction: ALTEREDAction | null
    renderedAction: ALTEREDAction | null
    isRenderingAction: boolean
    navigationTitle: string | undefined

    renderAction: (id: string) => void
    resetState: () => void
}

const ActionPaletteContext = createContext<ActionPaletteContextValue | null>(
    null
)

export function ActionPaletteProvider({ children }: { children: ReactNode }) {
    /**
     * @todo [P2] Set to true when loading our systems over the network.
     */
    const [isLoading] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

    const [selectedActionId, setSelectedActionId] = useState<string | null>(
        null
    )
    const [renderedActionId, setRenderedActionId] = useState<string | null>(
        null
    )

    const systems = Object.values(staticSystems)
    const filteredSystems = filterSystems(systems, {
        searchText,
        searchableKeyPaths: [
            "name",
            "title",
            "description",
            "actions.name",
            "actions.title",
            "actions.description",
            "actions.trigger"
        ]
    })

    /**
     * @todo [P3] Figure out if we should generalize the types at definition (by assigning the type rather than using `satisfies`) to avoid casting.
     */
    const findAction = (id: string) =>
        (systems as ALTEREDSystem[])
            .flatMap(system => system.actions)
            .find(action => action.id === id) ?? null

    const selectedAction = selectedActionId
        ? findAction(selectedActionId)
        : null
    const renderedAction = renderedActionId
        ? findAction(renderedActionId)
        : null
    const isRenderingAction = renderedActionId !== null

    const navigationTitle =
        selectedActionId && !isRenderingAction
            ? `Confirm: Press "space" to open "${selectedAction?.name}"`
            : undefined

    const handleAutoSelect = (searchText: string) => {
        const confirmCharacter = " "
        const containsConfirmCharacter = searchText.endsWith(confirmCharacter)
        const matchableSearchText = containsConfirmCharacter
            ? searchText.slice(0, -confirmCharacter.length)
            : searchText

        const matchedAction = systems
            .flatMap(system => system.actions as ALTEREDAction[])
            .find(action => action.trigger === matchableSearchText)

        setSelectedActionId(matchedAction ? matchedAction.id : null)

        if (matchedAction && containsConfirmCharacter)
            renderAction(matchedAction.id)
    }

    const onSearchTextChange = (searchText: string) => {
        setSearchText(searchText)

        handleAutoSelect(searchText)
    }

    const renderAction = (id: string) => {
        setRenderedActionId(id)

        setSearchText("")

        //  Additionally required when conditionally rendering views, since the search bar state is stored globally by Raycast.
        clearSearchBar()
    }

    const resetState = () => {
        setSearchText("")

        setSelectedItemId(null)
        setSelectedActionId(null)

        setRenderedActionId(null)
    }

    return (
        <ActionPaletteContext
            value={{
                isLoading,
                isRenderingAction,

                searchText,
                setSearchText,
                onSearchTextChange,
                selectedItemId,
                setSelectedItemId,

                selectedActionId,
                setSelectedActionId,
                renderedActionId,

                systems,
                filteredSystems,
                selectedAction,
                renderedAction,
                navigationTitle,

                renderAction,
                resetState
            }}
        >
            {children}
        </ActionPaletteContext>
    )
}

export function useActionPalette<
    Safe extends boolean = false,
    Result = Safe extends true
        ? ActionPaletteContextValue | null
        : ActionPaletteContextValue
>(props?: { safe?: Safe }): Result {
    const context = use(ActionPaletteContext)

    if (!(context || props?.safe))
        throw new Error(
            "`useActionPalette` must be used within an `ActionPaletteProvider`."
        )

    return context as Result
}
