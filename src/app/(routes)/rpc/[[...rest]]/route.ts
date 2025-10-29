/**
 *
 */

import { RPCHandler } from "@orpc/server/fetch"
import { router } from "~/server/api"

const handler = new RPCHandler(router)

async function handleRequest(request: Request) {
    const { response } = await handler.handle(request, {
        prefix: "/rpc",
        context: {
            _: { headers: Object.fromEntries(request.headers) }
        }
    })

    return response ?? new Response("Not found", { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
