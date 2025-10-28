/**
 *
 */

"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "~/lib/infra/rpc"

export function ClientRPCTest() {
    const { data: { thought } = {}, isLoading } = useQuery(apiClient.thoughts.getLatest.queryOptions())

    if (isLoading) return <div>Loading...</div>
    if (!thought) return <div>No thought found</div>

    return <div className="text-center">{`Latest thought (client): ${thought.content}`}</div>
}
