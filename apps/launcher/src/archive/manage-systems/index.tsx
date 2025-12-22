// /**
//  * Manage Systems command - CRUD interface for systems, actions, interfaces, components, and operations.
//  */

// import { System } from "@altered/data/shapes"
// import { Grid, Icon } from "@raycast/api"
// import { useState, useEffect } from "react"
// import { mockSystems } from "../../constants/mocks/systems"
// import { loadSystems, deleteSystem } from "../../lib/storage/systems"
// import { createManageSystemsOperations, createManageSystemsHandlers } from "./operations"
// import { createOperationAdapter } from "../operations"
// import { OperationAdapterContext } from "../operations-context"
// import { useNavigationHistory } from "../use-navigation-history"
// import React from "react"

// export function ManageSystems() {
//     const [customSystems, setCustomSystems] = useState<System[]>([])
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(() => {
//         loadSystems().then(systems => {
//             console.log("[ManageSystems] Initial load:", { count: systems.length, ids: systems.map(s => s.id) })
//             setCustomSystems(systems)
//             setIsLoading(false)
//         })
//     }, [])

//     const allSystems = [...mockSystems, ...customSystems]
//     console.log("[ManageSystems] All systems:", { mockCount: mockSystems.length, customCount: customSystems.length, totalCount: allSystems.length, customIds: customSystems.map(s => s.id) })

//     const handleDeleteSystem = async (systemId: string) => {
//         await deleteSystem(systemId)
//         const updated = await loadSystems()
//         setCustomSystems(updated)
//     }

//     const refreshSystems = async () => {
//         console.log("[ManageSystems] refreshSystems called")
//         const systems = await loadSystems()
//         console.log("[ManageSystems] Loaded systems:", { count: systems.length, ids: systems.map(s => s.id) })
//         setCustomSystems(systems)
//     }

//     // Navigation history management
//     const navigation = useNavigationHistory()

//     // If we have a current component in history and it's not the root, render it
//     // When history is empty or only has root, we render the Grid below
//     if (navigation.current && navigation.current.id !== "root") {
//         console.log("[ManageSystems] Rendering current component from history:", { id: navigation.current.id, historyLength: navigation.history.length, historyIds: navigation.history.map(e => e.id) })
//         return navigation.current.component
//     }

//     console.log("[ManageSystems] Rendering Grid (root view)", { currentId: navigation.current?.id, historyLength: navigation.history.length, canGoBack: navigation.canGoBack, historyIds: navigation.history.map(e => e.id) })

//     const adapterContext: OperationAdapterContext = {
//         state: {
//             reset: () => {
//                 navigation.reset()
//             },
//             pushHistory: (component: React.ReactElement, id?: string) => {
//                 navigation.push(component, id)
//             },
//             popHistory: () => {
//                 navigation.pop()
//             },
//             replaceHistory: (component: React.ReactElement, id?: string) => {
//                 navigation.replace(component, id)
//             }
//         }
//     }

//     // Debug: Log navigation state
//     console.log("[ManageSystems] Navigation state:", { hasNavigation: !!navigation, hasPop: !!navigation?.pop, currentId: navigation.current?.id })

//     // Global operations (show on grid container) - includes operations with scope "global"
//     const globalOperations = createManageSystemsOperations({ refreshSystems, handleDeleteSystem, navigation })
//     const globalHandlers = createManageSystemsHandlers({ refreshSystems, handleDeleteSystem, navigation })
//     const globalAdapterResult = createOperationAdapter(globalOperations, adapterContext, undefined, undefined, "global", globalHandlers)

//     return (
//         <Grid columns={8} inset={Grid.Inset.Large} isLoading={isLoading} searchBarPlaceholder="Search systems..." actions={globalAdapterResult.actionPanel}>
//             {allSystems.map(system => {
//                 const isHardcoded = mockSystems.some((s: System) => s.id === system.id)

//                 // Item-specific operations (includes both "global" and "current" scoped operations)
//                 const itemOperations = createManageSystemsOperations({
//                     refreshSystems,
//                     handleDeleteSystem,
//                     systemId: system.id,
//                     system,
//                     isHardcoded,
//                     navigation
//                 })
//                 const itemHandlers = createManageSystemsHandlers({
//                     refreshSystems,
//                     handleDeleteSystem,
//                     systemId: system.id,
//                     system,
//                     isHardcoded,
//                     navigation
//                 })
//                 // For items, show both global and current scoped operations
//                 const itemAdapterResult = createOperationAdapter(itemOperations, adapterContext, undefined, undefined, "current", itemHandlers)

//                 return <Grid.Item key={system.id} content={{ value: { source: Icon.Book, tintColor: isHardcoded ? Icon.Lock : undefined }, tooltip: system.name }} title={system.name} subtitle={system.objectiveTitle} actions={itemAdapterResult.actionPanel} />
//             })}
//             {allSystems.length === 0 && <Grid.EmptyView icon={Icon.Book} title="No Systems" description="Press Cmd+N to create your first system" />}
//         </Grid>
//     )
// }
