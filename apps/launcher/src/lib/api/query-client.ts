/**
 *
 */

import { StandardRPCJsonSerializer } from "@orpc/client/standard"
import { QueryClient } from "@tanstack/react-query"

const serializer = new StandardRPCJsonSerializer({
    customJsonSerializers: []
})

export const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                queryKeyHashFn(queryKey) {
                    const [json, meta] = serializer.serialize(queryKey)
                    return JSON.stringify({ json, meta })
                },

                /**
                 * @remarks Greater than 0 to prevent immediate refetching on mount.
                 */
                staleTime: 60 * 1000
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
