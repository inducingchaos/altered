// /**
//  * Manage Systems command - CRUD interface for systems, actions, interfaces, components, and operations.
//  */

// import { System } from "@altered/data/shapes"
// import { Grid, Icon } from "@raycast/api"
// import { useState, useEffect } from "react"
// import { mockSystems } from "../../constants/mocks/systems"
// import { loadSystems, deleteSystem } from "../../lib/storage/systems"
// import { createManageSystemsOperations, createManageSystemsHandlers } from "../../app/manage-systems/operations"
// import { createOperationAdapter } from "~/adapter/operations/operations"
// import { OperationAdapterContext } from "~/adapter/operations/context"
// import { useNavigationHistory } from "~/shared/hooks/use-navigation-history"
// import React from "react"

// export function ManageSystems() {
//     const [customSystems, setCustomSystems] = useState<System[]>([])
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(() => {
//         loadSystems().then(systems => {
//             setCustomSystems(systems)
//             setIsLoading(false)
//         })
//     }, [])

//     const allSystems = [...mockSystems, ...customSystems]

//     const handleDeleteSystem = async (systemId: string) => {
//         await deleteSystem(systemId)
//         const updated = await loadSystems()
//         setCustomSystems(updated)
//     }

//     const refreshSystems = () => {
//         loadSystems().then(setCustomSystems)
//     }

//     // Navigation history management
//     const navigation = useNavigationHistory()

//     // If we have a current component in history, render it
//     if (navigation.current && navigation.current.id !== "root") {
//         return navigation.current.component
//     }

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

//     // Global operations (show on grid container) - includes operations with scope "global"
//     const globalOperations = createManageSystemsOperations({ refreshSystems, handleDeleteSystem, navigation })
//     const globalHandlers = createManageSystemsHandlers({ refreshSystems, handleDeleteSystem, navigation })
//     const globalAdapterResult = createOperationAdapter(globalOperations, adapterContext, undefined, undefined, "global", globalHandlers)

//     return (
//         <Grid columns={8} inset={Grid.Inset.Large} isLoading={isLoading} searchBarPlaceholder="Search systems..." actions={globalAdapterResult.actionPanel}>
//             {allSystems.map(system => {
//                 const isHardcoded = mockSystems.some(s => s.id === system.id)

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

// entry point

// /**
//  *
//  */

// import { ManageSystems } from "./app/manage-systems"

// export default function ManageSystemsCommand() {
//     return <ManageSystems />
// }

// package.json

// {
//     "name": "manage-systems",
//     "title": "Manage Systems",
//     "description": "Create and manage your ALTERED Systems.",
//     "mode": "view"
// },
