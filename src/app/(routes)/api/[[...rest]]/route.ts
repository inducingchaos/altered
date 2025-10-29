/**
 *
 */

import { experimental_ArkTypeToJsonSchemaConverter as ArkTypeToJsonSchemaConverter } from "@orpc/arktype"
import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins"
import { onError } from "@orpc/server"
import { CORSPlugin } from "@orpc/server/plugins"
import { router } from "~/server/api"

const handler = new OpenAPIHandler(router, {
    plugins: [
        new CORSPlugin(),
        new OpenAPIReferencePlugin({
            docsProvider: "swagger",
            schemaConverters: [new ArkTypeToJsonSchemaConverter()],
            specGenerateOptions: { filter: ({ contract }) => !contract["~orpc"].route.tags?.includes("internal") }
        })
    ],
    interceptors: [onError(error => console.error(error))],
    filter: ({ contract }) => !contract["~orpc"].route.tags?.includes("internal")
})

async function handleRequest(request: Request) {
    const { matched, response } = await handler.handle(request, {
        prefix: "/api",
        context: { _: { headers: Object.fromEntries(request.headers) } }
    })

    if (matched) return response

    return new Response("Not found", { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
