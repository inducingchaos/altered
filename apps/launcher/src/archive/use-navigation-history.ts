// /**
//  * Navigation history management hook.
//  * Manages a stack of components/views for custom navigation.
//  */

// import { useState, useCallback } from "react"
// import React from "react"

// export type HistoryEntry = {
//     id: string
//     component: React.ReactElement
//     timestamp: number
// }

// export type NavigationHistory = {
//     history: HistoryEntry[]
//     current: HistoryEntry | null
//     push: (component: React.ReactElement, id?: string) => void
//     pop: () => void
//     replace: (component: React.ReactElement, id?: string) => void
//     reset: () => void
//     canGoBack: boolean
// }

// /**
//  * Hook for managing navigation history stack.
//  */
// export function useNavigationHistory(initialComponent?: React.ReactElement): NavigationHistory {
//     const [history, setHistory] = useState<HistoryEntry[]>(() => {
//         if (initialComponent) {
//             return [
//                 {
//                     id: "root",
//                     component: initialComponent,
//                     timestamp: Date.now()
//                 }
//             ]
//         }
//         return []
//     })

//     const push = useCallback((component: React.ReactElement, id?: string) => {
//         setHistory(prev => [
//             ...prev,
//             {
//                 id: id ?? `entry-${Date.now()}`,
//                 component,
//                 timestamp: Date.now()
//             }
//         ])
//     }, [])

//     const pop = useCallback(() => {
//         setHistory(prev => {
//             console.log("[useNavigationHistory] pop called", { prevLength: prev.length, prevIds: prev.map(e => e.id) })
//             if (prev.length <= 1) {
//                 console.log("[useNavigationHistory] pop: history too short, returning empty")
//                 return [] // Return empty array to go back to root
//             }
//             const newHistory = prev.slice(0, -1)
//             console.log("[useNavigationHistory] pop: new history", { newLength: newHistory.length, newIds: newHistory.map(e => e.id) })
//             return newHistory
//         })
//     }, [])

//     const replace = useCallback((component: React.ReactElement, id?: string) => {
//         setHistory(prev => {
//             if (prev.length === 0) {
//                 return [
//                     {
//                         id: id ?? "root",
//                         component,
//                         timestamp: Date.now()
//                     }
//                 ]
//             }
//             return [
//                 ...prev.slice(0, -1),
//                 {
//                     id: id ?? `entry-${Date.now()}`,
//                     component,
//                     timestamp: Date.now()
//                 }
//             ]
//         })
//     }, [])

//     const reset = useCallback(() => {
//         setHistory(prev => (prev.length > 0 ? [prev[0]] : []))
//     }, [])

//     const current = history.length > 0 ? history[history.length - 1] : null
//     const canGoBack = history.length > 1

//     return {
//         history,
//         current,
//         push,
//         pop,
//         replace,
//         reset,
//         canGoBack
//     }
// }
