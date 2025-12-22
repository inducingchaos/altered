// /**
//  * Action Palette provider - manages state for the Action Palette command.
//  */

// import { ALTEREDAction, System } from "@altered/data/shapes"
// import { createContext, ReactNode, use, useCallback, useEffect, useMemo, useState } from "react"
// import { OperationAdapterContext } from "~/adapter/operations/context"
// import * as appSystems from "../../systems"

// type ActionPaletteState = {
//     isLoading: boolean
//     searchText: string
//     customSystems: System[]
//     selectedActionId: string | null
//     renderSelectedAction: boolean
//     interfaceIndex: number
// }

// type ActionPaletteActions = {
//     setSearchText: (text: string) => void
//     setSelectedActionId: (id: string | null) => void
//     setRenderSelectedAction: (render: boolean) => void
//     setInterfaceIndex: (index: number) => void
//     resetState: () => void
//     handleAutoSelect: (searchText: string) => void
//     onSearchTextChange: (searchText: string) => void
// }

// type ActionPaletteContextValue = {
//     state: ActionPaletteState
//     actions: ActionPaletteActions
//     computed: {
//         systems: System[]
//         selectedAction: ALTEREDAction | null
//         navigationTitle: string | undefined
//         adapterContext: OperationAdapterContext
//     }
// }

// const ActionPaletteContext = createContext<ActionPaletteContextValue | null>(null)

// type ActionPaletteProviderProps = {
//     children: ReactNode
// }

// export function ActionPaletteProvider({ children }: ActionPaletteProviderProps) {
//     const [isLoading, setIsLoading] = useState(true)
//     const [searchText, setSearchText] = useState("")
//     const [customSystems, setCustomSystems] = useState<System[]>([])
//     const [selectedActionId, setSelectedActionId] = useState<string | null>(null)
//     const [renderSelectedAction, setRenderSelectedAction] = useState(false)
//     const [interfaceIndex, setInterfaceIndex] = useState(0)

//     useEffect(() => {
//         loadSystems().then((systems: System[]) => {
//             setCustomSystems(systems)
//             setIsLoading(false)
//         })
//     }, [])

//     const systems = useMemo(() => [...Object.values(appSystems), ...customSystems], [customSystems])

//     const selectedAction = useMemo(() => systems.flatMap(system => system.actions as ALTEREDAction[]).find(action => action.id === selectedActionId) ?? null, [systems, selectedActionId])

//     const navigationTitle = useMemo(() => (selectedActionId && !renderSelectedAction ? `Confirm: Press "space" to open "${selectedAction?.name}"` : undefined), [selectedActionId, renderSelectedAction, selectedAction?.name])

//     const handleAutoSelect = useCallback(
//         (searchText: string) => {
//             const confirmCharacter = " "
//             const containsConfirmCharacter = searchText.endsWith(confirmCharacter)
//             const matchableSearchText = containsConfirmCharacter ? searchText.slice(0, -confirmCharacter.length) : searchText

//             const matchedAction = systems.flatMap(system => system.actions as ALTEREDAction[]).find(action => action.launcherAlias === matchableSearchText)

//             setSelectedActionId(matchedAction ? matchedAction.id : null)

//             if (matchedAction && containsConfirmCharacter) setRenderSelectedAction(true)
//         },
//         [systems]
//     )

//     const onSearchTextChange = useCallback(
//         (searchText: string) => {
//             setSearchText(searchText)
//             handleAutoSelect(searchText)
//         },
//         [handleAutoSelect]
//     )

//     const resetState = useCallback(() => {
//         setSearchText("")
//         setSelectedActionId(null)
//         setRenderSelectedAction(false)
//     }, [])

//     const adapterContext: OperationAdapterContext = useMemo(
//         () => ({
//             state: {
//                 reset: resetState,
//                 navigateInterface: (index: number, action: "push" | "pop" | "replace") => {
//                     if (action === "push" || action === "replace") {
//                         setInterfaceIndex(index)
//                     } else if (action === "pop") {
//                         setInterfaceIndex(prev => Math.max(0, prev - 1))
//                     }
//                 }
//             }
//         }),
//         [resetState, setInterfaceIndex]
//     )

//     const value: ActionPaletteContextValue = useMemo(
//         () => ({
//             state: {
//                 isLoading,
//                 searchText,
//                 customSystems,
//                 selectedActionId,
//                 renderSelectedAction,
//                 interfaceIndex
//             },
//             actions: {
//                 setSearchText,
//                 setSelectedActionId,
//                 setRenderSelectedAction,
//                 setInterfaceIndex,
//                 resetState,
//                 handleAutoSelect,
//                 onSearchTextChange
//             },
//             computed: {
//                 systems,
//                 selectedAction,
//                 navigationTitle,
//                 adapterContext
//             }
//         }),
//         [isLoading, searchText, customSystems, selectedActionId, renderSelectedAction, interfaceIndex, resetState, handleAutoSelect, onSearchTextChange, systems, selectedAction, navigationTitle, adapterContext]
//     )

//     return <ActionPaletteContext.Provider value={value}>{children}</ActionPaletteContext.Provider>
// }

// export function useActionPalette(): ActionPaletteContextValue {
//     const context = use(ActionPaletteContext)
//     if (!context) {
//         throw new Error("useActionPalette must be used within ActionPaletteProvider")
//     }
//     return context
// }
