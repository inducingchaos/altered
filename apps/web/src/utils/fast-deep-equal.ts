/**
 *
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Complex by nature.
export function isEqual(
    a: unknown,
    b: unknown,
    options?: { react?: boolean }
): boolean {
    const { react = false } = options ?? {}

    if (a === b) return true

    if (a && b && typeof a === "object" && typeof b === "object") {
        if (a.constructor !== b.constructor) return false

        let length: number
        let i: number

        if (Array.isArray(a) && Array.isArray(b)) {
            length = a.length

            if (length !== b.length) return false

            for (i = length; i-- !== 0; ) if (!isEqual(a[i], b[i])) return false

            return true
        }

        if (a instanceof RegExp && b instanceof RegExp)
            return a.source === b.source && a.flags === b.flags

        if (a.valueOf !== Object.prototype.valueOf)
            return a.valueOf() === b.valueOf()

        if (a.toString !== Object.prototype.toString)
            return a.toString() === b.toString()

        const keys = Object.keys(a)

        length = keys.length

        if (length !== Object.keys(b).length) return false

        for (i = length; i-- !== 0; ) {
            const key = keys[i]

            if (!(key && Object.hasOwn(b, key))) return false
        }

        for (i = length; i-- !== 0; ) {
            const key = keys[i]

            if (
                react &&
                key === "_owner" &&
                (a as Record<string, unknown>).$$typeof
            ) {
                //  React-specific - avoid traversing the `_owner` property of React elements. It contains circular references, and is not needed for comparison.

                continue
            }

            if (
                !(
                    key &&
                    isEqual(
                        (a as Record<string, unknown>)[key],
                        (b as Record<string, unknown>)[key]
                    )
                )
            )
                return false
        }

        return true
    }

    // biome-ignore lint/suspicious/noSelfCompare: NaN check requires self-comparison.
    return a !== a && b !== b
}
