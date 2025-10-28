/**
 *
 */

"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "~/server"

export function ClientRPCTest() {
    const { data, isLoading } = useQuery(
        api.thoughts.get.queryOptions({
            input: { cursor: 1, limit: 10 }
        })
    )

    if (isLoading) return <div>Loading...</div>

    return <div className="text-center">{`Client RPC test: ${JSON.stringify(data?.thoughts?.[0])}`}</div>
}
