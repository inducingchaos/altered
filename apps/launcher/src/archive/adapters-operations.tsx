// /**
//  * Operations adapter - converts operation definitions to Raycast UI components.
//  */

// import { Operation, OperationDefinition, OperationID } from "@altered/data/shapes"
// import { Action, ActionPanel, Icon } from "@raycast/api"
// import React from "react"
// import { OperationAdapterContext } from "./context"
// import { operationHandlers, OperationHandlerContext } from "../adapter/registry/operations/operations"
// import { resolveKeypath, isKeypath, setKeypath } from "../adapter/operations/keypaths"
// import { InterfaceStateStoreHook } from "~/shared/stores/interface-state"

// /**
//  * Checks if an operation ID is a predefined operation.
//  */
// function isPredefinedOperation(id: string): id is OperationID {
//     return id in operationHandlers
// }

// /**
//  * Custom operation handler function type that can return React components for navigation.
//  */
// export type CustomOperationHandler = (operation: OperationDefinition, context: OperationAdapterContext) => React.ReactNode | (() => void) | undefined

// /**
//  * Creates a handler function for operations.
//  */
// function createOperationHandler(operation: OperationDefinition, context: OperationAdapterContext, interfaceContext?: Record<string, unknown>, stateStore?: InterfaceStateStoreHook, customHandlers?: Record<string, CustomOperationHandler>) {
//     return () => {
//         // Check for custom handler first
//         if (customHandlers && operation.id in customHandlers) {
//             const customResult = customHandlers[operation.id](operation, context)
//             if (typeof customResult === "function") {
//                 customResult()
//             }
//             return
//         }

//         const registryEntry = operationHandlers[operation.id as OperationID]
//         if (!registryEntry) {
//             console.warn(`Operation handler not found for ID: ${operation.id}`)
//             return
//         }

//         // Resolve inputs (keypaths or literals)
//         const resolvedInputs: Record<string, unknown> = {}
//         if (operation.inputs) {
//             for (const [key, value] of Object.entries(operation.inputs)) {
//                 if (isKeypath(value)) {
//                     if (stateStore) {
//                         resolvedInputs[key] = stateStore.getState().get(value)
//                     } else if (interfaceContext) {
//                         resolvedInputs[key] = resolveKeypath(value, interfaceContext)
//                     }
//                 } else {
//                     resolvedInputs[key] = value
//                 }
//             }
//         }

//         // Create handler context with state store access
//         const handlerContext: OperationHandlerContext = {
//             ...context,
//             inputs: resolvedInputs,
//             interfaceContext: stateStore ? stateStore.getState().state : interfaceContext
//         }

//         // Execute handler
//         const result = registryEntry.handler(handlerContext)

//         // Handle outputs (bind results to keypaths)
//         if (operation.outputs && result && typeof result === "object") {
//             for (const [outputId, keypath] of Object.entries(operation.outputs)) {
//                 if (isKeypath(keypath) && outputId in result) {
//                     const outputValue = (result as Record<string, unknown>)[outputId]
//                     if (stateStore) {
//                         stateStore.getState().set(keypath, outputValue)
//                     } else if (interfaceContext) {
//                         setKeypath(keypath, outputValue, interfaceContext)
//                     }
//                 }
//             }
//         }

//         // Handle special operations
//         if (operation.id === "delete-item" && result && typeof result === "object") {
//             const deleteResult = result as { keypath?: string }
//             if (deleteResult.keypath && stateStore) {
//                 stateStore.getState().delete(deleteResult.keypath)
//             }
//         }

//         if (operation.id === "delete-all-items" && result && typeof result === "object") {
//             const deleteResult = result as { keypath?: string }
//             if (deleteResult.keypath && stateStore) {
//                 const arrayValue = stateStore.getState().get(deleteResult.keypath)
//                 if (Array.isArray(arrayValue)) {
//                     // Clear array by setting to empty array
//                     stateStore.getState().set(deleteResult.keypath, [])
//                 }
//             }
//         }

//         // Handle navigation operations
//         if (operation.id === "push-interface" && result && typeof result === "object") {
//             const navResult = result as { navigateTo?: number }
//             if (navResult.navigateTo !== undefined && context.state.navigateInterface) {
//                 context.state.navigateInterface(navResult.navigateTo, "push")
//             }
//         }

//         if (operation.id === "pop-interface" && result && typeof result === "object") {
//             if (context.state.navigateInterface) {
//                 context.state.navigateInterface(0, "pop")
//             }
//         }

//         if (operation.id === "replace-interface" && result && typeof result === "object") {
//             const navResult = result as { navigateTo?: number }
//             if (navResult.navigateTo !== undefined && context.state.navigateInterface) {
//                 context.state.navigateInterface(navResult.navigateTo, "replace")
//             }
//         }
//     }
// }

// /**
//  * Result of operation adapter - contains action panel and any components to render.
//  */
// export type OperationAdapterResult = {
//     actionPanel: React.ReactElement
//     components?: React.ReactElement[]
// }

// /**
//  * Converts ALTERED operations to Raycast Action components.
//  * All operations are rendered as raw Action components.
//  *
//  * @param scopeFilter - If provided, only operations matching this scope will be included.
//  *                      "global" operations are always included regardless of filter.
//  * @param wrapActionPanel - If true, wraps actions in ActionPanel. Default true.
//  */
// export function createOperationAdapter(operations: Operation[], context: OperationAdapterContext, interfaceContext?: Record<string, unknown>, stateStore?: InterfaceStateStoreHook, scopeFilter?: "global" | "current", customHandlers?: Record<string, CustomOperationHandler>, wrapActionPanel: boolean = true): OperationAdapterResult {
//     const actionNodes: React.ReactNode[] = []
//     const components: React.ReactElement[] = []

//     for (const operation of operations) {
//         // Skip operations that should be hidden
//         if (operation.type === "operation" && operation.visibility === "none") {
//             continue
//         }

//         // Filter by scope if provided
//         if (operation.type === "operation" && scopeFilter) {
//             const operationScope = operation.scope ?? "current" // Default to current
//             // Global operations show on both container and items
//             // Current operations only show on items
//             if (scopeFilter === "global" && operationScope === "current") {
//                 // When filtering for global (container), skip current-scoped operations
//                 continue
//             }
//             // When filtering for current (items), include both global and current
//         }

//         if (operation.type === "group") {
//             const groupResult = createOperationAdapter(operation.operations, context, interfaceContext, stateStore, scopeFilter, customHandlers, false)
//             const actionPanelElement = groupResult.actionPanel as React.ReactElement<{ children?: React.ReactNode }>
//             const groupChildren = (actionPanelElement.props?.children || []) as React.ReactNode[]
//             actionNodes.push(
//                 <ActionPanel.Section key={operation.id} title={operation.name}>
//                     {groupChildren}
//                 </ActionPanel.Section>
//             )
//             if (groupResult.components) {
//                 components.push(...groupResult.components)
//             }
//             continue
//         }

//         if (operation.type === "operation") {
//             // Get operation metadata from registry if available
//             const registryEntry = isPredefinedOperation(operation.id) ? operationHandlers[operation.id] : null
//             const operationName = operation.name ?? registryEntry?.name ?? operation.id

//             // Handle push-history operation
//             if (operation.id === "push-history" && operation.inputs) {
//                 const componentName = operation.inputs.component as string
//                 if (customHandlers && componentName in customHandlers) {
//                     const component = customHandlers[componentName](operation, context)
//                     if (React.isValidElement(component)) {
//                         if (context.state.pushHistory) {
//                             actionNodes.push(<Action key={operation.id} title={operationName} icon={Icon.ArrowRight} onAction={() => context.state.pushHistory?.(component as React.ReactElement)} />)
//                         } else {
//                             // Fallback to Action.Push if no history management
//                             actionNodes.push(<Action.Push key={operation.id} title={operationName} icon={Icon.ArrowRight} target={component as React.ReactElement} />)
//                         }
//                         continue
//                     }
//                 }
//             }

//             // Check if custom handler returns a React component (for push operations)
//             if (customHandlers && operation.id in customHandlers) {
//                 const customResult = customHandlers[operation.id](operation, context)
//                 if (React.isValidElement(customResult)) {
//                     // Use history management if available, otherwise Action.Push
//                     if (context.state.pushHistory) {
//                         actionNodes.push(<Action key={operation.id} title={operationName} icon={operation.style === "destructive" ? Icon.Trash : Icon.ArrowRight} onAction={() => context.state.pushHistory?.(customResult as React.ReactElement)} />)
//                     } else {
//                         actionNodes.push(<Action.Push key={operation.id} title={operationName} icon={operation.style === "destructive" ? Icon.Trash : Icon.ArrowRight} target={customResult as React.ReactElement} />)
//                     }
//                     continue
//                 }
//             }

//             // Build action props
//             const actionProps: React.ComponentProps<typeof Action> = {
//                 title: operationName,
//                 onAction: createOperationHandler(operation, context, interfaceContext, stateStore, customHandlers)
//             }

//             // Apply style
//             if (operation.style === "destructive") {
//                 actionProps.style = Action.Style.Destructive
//             }

//             // Add icon based on operation type (can be extended)
//             if (operation.id === "dismiss-action") {
//                 actionProps.icon = Icon.XMarkTopRightSquare
//             } else if (operation.id === "return-to-action-palette") {
//                 actionProps.icon = Icon.ArrowLeftCircle
//             }

//             actionNodes.push(<Action key={operation.id} {...actionProps} />)
//         }
//     }

//     const actionPanel = wrapActionPanel ? <ActionPanel>{actionNodes}</ActionPanel> : ((<>{actionNodes}</>) as React.ReactElement)

//     return {
//         actionPanel,
//         components: components.length > 0 ? components : undefined
//     }
// }
