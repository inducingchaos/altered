/**
 *
 */

export function extendHeaders(
    headers: Headers,
    values: Record<string, string>
) {
    const newHeaders = new Headers(headers)

    for (const [key, value] of Object.entries(values))
        newHeaders.set(key, value)

    return newHeaders
}
