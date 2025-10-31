/**
 * Server component that fetches and displays the latest thought
 */

import { apiClient } from "~/lib/infra/rpc"

export async function ServerRPCTest() {
    const { thought } = await apiClient.thoughts.getLatest.call()

    if (!thought) return <div>No thought found</div>

    return <div className="text-center">{`Latest thought (server): ${thought.content}`}</div>
}
