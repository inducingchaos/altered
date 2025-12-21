/**
 *
 */

import { ALTEREDAction, System } from "@altered/data/shapes"
import { filterSystems } from "@altered/utils"
import * as staticSystems from "app/systems"
import { createContext, ReactNode, use, useState } from "react"

type ActionPaletteContextValue = {
    isLoading: boolean

    searchText: string
    setSearchText: (text: string) => void
    onSearchTextChange: (searchText: string) => void

    selectedActionId: string | null
    setSelectedActionId: (id: string | null) => void
    renderSelectedAction: boolean
    setRenderSelectedAction: (render: boolean) => void

    systems: System[]
    filteredSystems: System[]
    selectedAction: ALTEREDAction | null
    navigationTitle: string | undefined

    resetState: () => void
}

const ActionPaletteContext = createContext<ActionPaletteContextValue | null>(null)

export function ActionPaletteProvider({ children }: { children: ReactNode }) {
    /**
     * @todo [P2] Set to true when loading our systems over the network.
     */
    const [isLoading] = useState(false)
    const [searchText, setSearchText] = useState("")

    const [selectedActionId, setSelectedActionId] = useState<string | null>(null)
    const [renderSelectedAction, setRenderSelectedAction] = useState(false)

    const systems = Object.values(staticSystems)
    const filteredSystems = filterSystems(systems, {
        searchText,
        searchableKeyPaths: ["name", "title", "description", "actions.name", "actions.title", "actions.description"]
    })

    const selectedAction = systems.flatMap(system => system.actions).find(action => action.id === selectedActionId) ?? null

    const navigationTitle = selectedActionId && !renderSelectedAction ? `Confirm: Press "space" to open "${selectedAction?.name}"` : undefined

    const handleAutoSelect = (searchText: string) => {
        const confirmCharacter = " "
        const containsConfirmCharacter = searchText.endsWith(confirmCharacter)
        const matchableSearchText = containsConfirmCharacter ? searchText.slice(0, -confirmCharacter.length) : searchText

        const matchedAction = systems.flatMap(system => system.actions as ALTEREDAction[]).find(action => action.trigger === matchableSearchText)

        setSelectedActionId(matchedAction ? matchedAction.id : null)

        if (matchedAction && containsConfirmCharacter) setRenderSelectedAction(true)
    }

    const onSearchTextChange = (searchText: string) => {
        setSearchText(searchText)

        handleAutoSelect(searchText)
    }

    const resetState = () => {
        setSearchText("")

        setSelectedActionId(null)

        setRenderSelectedAction(false)
    }

    return (
        <ActionPaletteContext
            value={{
                isLoading,

                searchText,
                setSearchText,
                onSearchTextChange,

                selectedActionId,
                setSelectedActionId,
                renderSelectedAction,
                setRenderSelectedAction,

                systems,
                filteredSystems,
                selectedAction,
                navigationTitle,

                resetState
            }}
        >
            {children}
        </ActionPaletteContext>
    )
}

export function useActionPalette() {
    const context = use(ActionPaletteContext)

    if (!context) throw new Error("`useActionPalette` must be used within an `ActionPaletteProvider`.")

    return context
}
