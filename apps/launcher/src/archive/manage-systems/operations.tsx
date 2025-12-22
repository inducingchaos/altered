// /**
//  * Operations configuration for Manage Systems command.
//  */

// import { Operation, System } from "@altered/data/shapes"
// import { CustomOperationHandler } from "../operations"
// import { ActionsList } from "./actions-list"
// import { CreateSystem } from "./create-system"
// import { NavigationHistory } from "../use-navigation-history"
// import React from "react"

// type ManageSystemsOperationsConfig = {
//     refreshSystems: () => void
//     handleDeleteSystem: (systemId: string) => void
//     systemId?: string
//     system?: System
//     isHardcoded?: boolean
//     navigation?: NavigationHistory
// }

// /**
//  * Creates operations for the Manage Systems grid.
//  */
// export function createManageSystemsOperations(config: ManageSystemsOperationsConfig): Operation[] {
//     const operations: Operation[] = [
//         {
//             type: "operation",
//             _predefined: false,
//             id: "create-system",
//             name: "Create New System",
//             description: "Create a new ALTERED system",
//             scope: "global", // Show on both grid and items
//             visibility: "context-menu"
//         }
//     ]

//     if (config.systemId && config.system) {
//         operations.push({
//             type: "operation",
//             _predefined: false,
//             id: "open-system",
//             name: `Open ${config.system.name}`,
//             description: `Open ${config.system.name}`,
//             scope: "current", // Show only on items
//             visibility: "context-menu"
//         })

//         // Only show delete for non-hardcoded systems
//         if (!config.isHardcoded) {
//             operations.push({
//                 type: "operation",
//                 _predefined: false,
//                 id: "delete-system",
//                 name: "Delete System",
//                 description: "Delete this system",
//                 scope: "current",
//                 visibility: "context-menu",
//                 style: "destructive"
//             })
//         }
//     }

//     return operations
// }

// /**
//  * Creates custom operation handlers for Manage Systems.
//  */
// export function createManageSystemsHandlers(config: ManageSystemsOperationsConfig): Record<string, CustomOperationHandler> {
//     // Capture navigation in closure to ensure it's available when handler is called
//     const navigation = config.navigation

//     console.log("[createManageSystemsHandlers] Navigation:", navigation ? "exists" : "undefined", { hasPop: !!navigation?.pop })

//     return {
//         "create-system": () => {
//             if (!navigation) {
//                 console.warn("[create-system handler] Navigation not available in config for create-system operation")
//             } else {
//                 console.log("[create-system handler] Navigation available, creating component")
//             }
//             return <CreateSystem onSave={config.refreshSystems} navigation={navigation} />
//         },
//         "open-system": () => {
//             if (config.systemId && config.system) {
//                 return <ActionsList systemId={config.systemId} system={config.system} navigation={config.navigation} />
//             }
//             return undefined
//         },
//         "delete-system": () => {
//             if (config.systemId) {
//                 config.handleDeleteSystem(config.systemId)
//             }
//             return undefined
//         }
//     }
// }
