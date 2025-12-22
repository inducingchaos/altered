// /**
//  * localStorage utilities for managing custom systems.
//  */

// import { LocalStorage } from "@raycast/api"
// import { System } from "@altered/data/shapes"

// const STORAGE_KEY = "altered-systems"

// /**
//  * Load all systems from localStorage.
//  */
// export async function loadSystems(): Promise<System[]> {
//     try {
//         const systemsJson = await LocalStorage.getItem<string>(STORAGE_KEY)
//         if (!systemsJson) {
//             return []
//         }
//         return JSON.parse(systemsJson) as System[]
//     } catch (error) {
//         console.error("Failed to load systems from localStorage:", error)
//         return []
//     }
// }

// /**
//  * Save a system to localStorage.
//  */
// export async function saveSystem(system: System): Promise<void> {
//     try {
//         const systems = await loadSystems()
//         const existingIndex = systems.findIndex(s => s.id === system.id)

//         if (existingIndex >= 0) {
//             systems[existingIndex] = system
//         } else {
//             systems.push(system)
//         }

//         await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(systems))
//     } catch (error) {
//         console.error("Failed to save system to localStorage:", error)
//         throw error
//     }
// }

// /**
//  * Delete a system from localStorage.
//  */
// export async function deleteSystem(systemId: string): Promise<void> {
//     try {
//         const systems = await loadSystems()
//         const filtered = systems.filter(s => s.id !== systemId)
//         await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
//     } catch (error) {
//         console.error("Failed to delete system from localStorage:", error)
//         throw error
//     }
// }

// /**
//  * Load a single system by ID.
//  */
// export async function loadSystem(systemId: string): Promise<System | null> {
//     try {
//         const systems = await loadSystems()
//         return systems.find(s => s.id === systemId) ?? null
//     } catch (error) {
//         console.error("Failed to load system from localStorage:", error)
//         return null
//     }
// }
