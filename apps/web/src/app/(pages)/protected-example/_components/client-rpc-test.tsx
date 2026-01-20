/**
 * @todo [P3] Re-evaluate this component when our MVP is complete.
 */

"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "~/lib/infra/rpc"

/**
 * @todo [P3] Consider using the unsafe RPC client for `useQuery` calls, so that we can consolidate the error handling.
 */
export function ClientRPCTest() {
    const { data, isLoading } = useQuery(api.thoughts.getLatest.queryOptions())
    if (!data || isLoading) return <div>Loading...</div>

    const { data: safeData, error } = data
    if (error) return <div>Error: {error.message}</div>

    const { thought } = safeData
    if (!thought) return <div>No thought found</div>

    return (
        <div className="text-center">{`Latest thought (client): ${thought.content}`}</div>
    )
}
