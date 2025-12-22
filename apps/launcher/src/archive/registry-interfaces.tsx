// /**
//  * Interface adapters - convert interface definitions to Raycast UI components.
//  * Auto-detects interface type from root component's `id`.
//  */

// import { Interface } from "@altered/data/shapes"
// import { OperationAdapterContext } from "../adapter/operations/context"
// import { useEffect, useMemo } from "react"
// import { operationHandlers } from "../adapter/registry/operations/operations"
// import React from "react"
// import { renderComponent } from "../adapter-components"
// import { createInterfaceStateStore, InterfaceStateStoreHook } from "~/shared/stores/interface-state"
// import { isKeypath } from "../adapter/operations/keypaths"
// import { nanoid } from "nanoid"

// /**
//  * Handles auto-activation of operations on interface load.
//  */
// function useAutoActivateOperations(operations: Interface["operations"], context: OperationAdapterContext, stateStore: InterfaceStateStoreHook) {
//     useEffect(() => {
//         if (!operations) return

//         for (const operation of operations) {
//             if (operation.type === "operation" && operation.activation === "onLoad") {
//                 const registryEntry = operationHandlers[operation.id as keyof typeof operationHandlers]
//                 if (registryEntry) {
//                     // Resolve inputs using state store
//                     const resolvedInputs: Record<string, unknown> = {}
//                     if (operation.inputs) {
//                         for (const [key, value] of Object.entries(operation.inputs)) {
//                             if (isKeypath(value)) {
//                                 resolvedInputs[key] = stateStore.getState().get(value)
//                             } else {
//                                 resolvedInputs[key] = value
//                             }
//                         }
//                     }

//                     // Execute handler
//                     registryEntry.handler({
//                         ...context,
//                         inputs: resolvedInputs,
//                         interfaceContext: stateStore.getState().state
//                     })
//                 }
//             }
//         }
//     }, []) // Only run on mount
// }

// /**
//  * Component wrapper for interface adapter that allows hooks to be called.
//  */
// function InterfaceAdapterComponent({ interface_, context }: { interface_: Interface; context: OperationAdapterContext }) {
//     // Memoize storage key to ensure it's stable across renders
//     const storageKey = useMemo(() => `altered-interface-${interface_.components?.id ?? nanoid()}`, [interface_.components?.id])

//     // Memoize state store to create it once per component instance
//     const stateStore = useMemo(() => createInterfaceStateStore(storageKey, interface_.state), [storageKey, interface_.state])

//     // Initialize state if provided
//     useEffect(() => {
//         if (interface_.state) {
//             stateStore.getState().initialize(interface_.state)
//         }
//     }, [interface_.state, stateStore])

//     // Auto-activate operations
//     useAutoActivateOperations(interface_.operations, context, stateStore)

//     // Render root component
//     if (!interface_.components) {
//         return <div>No component defined</div>
//     }

//     return <>{renderComponent(interface_.components, { component: interface_.components, context, stateStore })}</>
// }

// /**
//  * Creates an interface adapter that auto-detects type from root component.
//  */
// export function createInterfaceAdapter(interface_: Interface, context: OperationAdapterContext): React.ReactElement {
//     return <InterfaceAdapterComponent interface_={interface_} context={context} />
// }
