/**
 *
 */

import { api } from "~/lib/infra/rpc"

export async function ServerRPCTest() {
    const { data, error } = await api.thoughts.getLatest.call()
    if (error) return <div>Error: {error.message}</div>

    const { thought } = data
    if (!thought) return <div>No thought found</div>

    return (
        <div className="text-center">{`Latest thought (server): ${thought.content}`}</div>
    )
}
