/**
 *
 */

import type { Thought } from "@altered/data/shapes"
import type { APIError } from "@altered/harness"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAuthentication } from "~/auth"
import { config } from "~/config"
import { useThoughtsQueryOptions } from "./use-thoughts-query-options"

type RaycastPaginationOptions = {
    pageSize: number
    hasMore: boolean
    onLoadMore: () => void
}

type UseThoughtsBaseValue = {
    isFetching: boolean

    refresh: () => void

    pagination: RaycastPaginationOptions
}

/**
 * @remarks Currently used as an indicator of "isFetching" rather than "isLoading", since it covers more use cases. We can still get the intrinsic loading state using `const isLoading = isFetching && thoughts === null`.
 */
type UseThoughtsFetchingValue = UseThoughtsBaseValue & {
    status: "fetching"
    thoughts: Thought[] | null
    error: null
}

type UseThoughtsSuccessValue = UseThoughtsBaseValue & {
    status: "success"
    thoughts: Thought[]
    error: null
}

type UseThoughtsErrorValue = UseThoughtsBaseValue & {
    status: "error"
    thoughts: null
    error: APIError
}

type UseThoughtsValue =
    | UseThoughtsFetchingValue
    | UseThoughtsSuccessValue
    | UseThoughtsErrorValue

export function useThoughts() {
    const { isAuthed, token: authToken } = useAuthentication()
    if (!isAuthed)
        throw new Error(
            "`useThoughts` must be used within an authenticated context."
        )

    const getThoughtsQueryOptions = useThoughtsQueryOptions({ authToken })

    const { isFetching, data, error, hasNextPage, fetchNextPage, refetch } =
        useInfiniteQuery(getThoughtsQueryOptions)

    const thoughts = data?.pages.flatMap(page => page.thoughts ?? []) ?? null

    const pagination: RaycastPaginationOptions = useMemo(
        () => ({
            pageSize: config.listPaginationLimit,
            hasMore: hasNextPage,
            onLoadMore: fetchNextPage
        }),
        [hasNextPage, fetchNextPage]
    )

    const baseValue: UseThoughtsBaseValue = useMemo(
        () => ({
            isFetching,

            refresh: refetch,

            pagination
        }),
        [isFetching, pagination]
    )

    /**
     * @remarks Assumes the following data combinations. If we hit an edge case, we may need to investigate more and adjust.
     */
    const value: UseThoughtsValue = useMemo(() => {
        if (isFetching)
            return {
                ...baseValue,

                status: "fetching",
                thoughts,
                error: null
            }

        if (error)
            return {
                ...baseValue,

                status: "error",
                thoughts: null,
                error
            }

        if (!error && thoughts)
            return {
                ...baseValue,

                status: "success",
                thoughts,
                error: null
            }

        throw new Error(
            "Invalid `ThoughtsContext` value. This should never happen.",
            {
                cause: {
                    isFetching: !!isFetching,
                    error: !!error,
                    thoughts: !!thoughts
                }
            }
        )
    }, [baseValue, isFetching, error, thoughts])

    return value
}
