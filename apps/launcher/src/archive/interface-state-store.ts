// /**
//  * Zustand store for interface state management.
//  * Provides keypath-based state access with auto-save to localStorage.
//  */

// import { create } from "zustand"
// import { LocalStorage } from "@raycast/api"
// import { setKeypath, deleteKeypath, resolveKeypath } from "./operations-keypaths"

// /**
//  * Interface state store.
//  */
// interface InterfaceStateStore {
//     /**
//      * State data.
//      */
//     state: Record<string, unknown>

//     /**
//      * Get value at keypath.
//      */
//     get: (keypath: string) => unknown

//     /**
//      * Set value at keypath.
//      */
//     set: (keypath: string, value: unknown) => void

//     /**
//      * Delete value at keypath.
//      */
//     delete: (keypath: string) => void

//     /**
//      * Initialize state from initial data.
//      */
//     initialize: (initialState?: Record<string, unknown>) => void

//     /**
//      * Clear all state.
//      */
//     clear: () => void
// }

// /**
//  * Creates an interface state store.
//  *
//  * @param storageKey - localStorage key for auto-saving state
//  * @param initialState - Initial state data
//  */
// export function createInterfaceStateStore(storageKey: string, initialState?: Record<string, unknown>) {
//     return create<InterfaceStateStore>((set, get) => ({
//         state: initialState ?? {},

//         get: (keypath: string) => {
//             const state = get().state
//             return resolveKeypath(keypath, state)
//         },

//         set: (keypath: string, value: unknown) => {
//             set(store => {
//                 const newState = { ...store.state }
//                 setKeypath(keypath, value, newState)

//                 // Auto-save to localStorage
//                 LocalStorage.setItem(storageKey, JSON.stringify(newState)).catch(console.error)

//                 return { state: newState }
//             })
//         },

//         delete: (keypath: string) => {
//             set(store => {
//                 const newState = { ...store.state }
//                 deleteKeypath(keypath, newState)

//                 // Auto-save to localStorage
//                 LocalStorage.setItem(storageKey, JSON.stringify(newState)).catch(console.error)

//                 return { state: newState }
//             })
//         },

//         initialize: (initialState?: Record<string, unknown>) => {
//             set({ state: initialState ?? {} })
//         },

//         clear: () => {
//             set({ state: {} })
//             LocalStorage.removeItem(storageKey).catch(console.error)
//         }
//     }))
// }

// /**
//  * Type for the store hook.
//  */
// export type InterfaceStateStoreHook = ReturnType<typeof createInterfaceStateStore>
