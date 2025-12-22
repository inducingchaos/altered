// /**
//  * Hook for interface state management using Zustand.
//  */

// import { useEffect } from "react"
// import { createInterfaceStateStore, InterfaceStateStoreHook } from "../../../archive/interface-state-store"

// /**
//  * Hook to create and initialize an interface state store.
//  *
//  * @param storageKey - Unique key for localStorage persistence
//  * @param initialState - Initial state data
//  * @returns Zustand store hook
//  */
// export function useInterfaceState(storageKey: string, initialState?: Record<string, unknown>): InterfaceStateStoreHook {
//     const store = createInterfaceStateStore(storageKey, initialState)

//     useEffect(() => {
//         if (initialState) {
//             store.getState().initialize(initialState)
//         }
//     }, [storageKey, store])

//     return store
// }
