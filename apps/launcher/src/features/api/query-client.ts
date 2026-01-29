/**
 *
 */

import { StandardRPCJsonSerializer } from "@orpc/client/standard"
import { Cache } from "@raycast/api"
import {
    type AsyncStorage,
    experimental_createQueryPersister,
    type PersistedQuery
} from "@tanstack/query-persist-client-core"
import { QueryClient } from "@tanstack/react-query"

const serializer = new StandardRPCJsonSerializer({
    customJsonSerializers: []
})

const cache = new Cache({ namespace: "tanstack-query" })

/**
 * An adapter that makes Raycast's Cache API compatible with the TanStack Query `AsyncStorage` interface.
 */
const raycastCacheStorage = {
    getItem: (key: string) => cache.get(key) ?? null,

    setItem: (key: string, value: string) => cache.set(key, value),

    removeItem: (key: string) => void cache.remove(key)
} satisfies AsyncStorage

function getMilliseconds({
    duration,
    unit
}: {
    duration: number
    unit: "days" | "hours" | "minutes" | "seconds"
}) {
    switch (unit) {
        case "days":
            return 1000 * 60 * 60 * 24 * duration
        case "hours":
            return 1000 * 60 * 60 * duration
        case "minutes":
            return 1000 * 60 * duration
        case "seconds":
            return 1000 * duration
        default:
            throw new Error(`Invalid unit: ${unit}`)
    }
}

const cacheDurations = {
    invalidate: getMilliseconds({ duration: 5, unit: "minutes" }),
    purge: getMilliseconds({ duration: 1, unit: "days" })
}

/**
 * A client for persisting Tanstack Query data to disk using Raycast's Cache API.
 *
 * @todo [P3] Investigate the serialization strategy to understand what's happening.
 */
export const queryPersister = experimental_createQueryPersister({
    storage: raycastCacheStorage,

    maxAge: cacheDurations.purge,

    /**
     * @todo [P3] Evaluate the validity of this prefix.
     */
    prefix: "altered-query",

    serialize: data => {
        const [json, meta] = serializer.serialize(data)

        return JSON.stringify({ json, meta })
    },
    deserialize: cachedString => {
        const { json, meta } = JSON.parse(cachedString)

        return serializer.deserialize(json, meta) as PersistedQuery
    }
})

export const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                queryKeyHashFn(queryKey) {
                    const [json, meta] = serializer.serialize(queryKey)
                    return JSON.stringify({ json, meta })
                },

                staleTime: cacheDurations.invalidate,
                gcTime: cacheDurations.purge,

                persister: queryPersister.persisterFn
            },
            dehydrate: {
                serializeData(data) {
                    const [json, meta] = serializer.serialize(data)
                    return { json, meta }
                }
            },
            hydrate: {
                deserializeData(data) {
                    return serializer.deserialize(data.json, data.meta)
                }
            }
        }
    })
