/**
 *
 */

/**
 * Converts all spaces into separators, in addition to existing separators.
 */
type FullSeparatorSpacing = "full"

/**
 * Adds one separator if any spaces are present. Preserves all existing separators.
 */
type ConventionalSeparatorSpacing = "conventional"

/**
 * Omits all spaces, but preserves all existing separators.
 */
type PreserveSeparatorSpacing = "preserve"

/**
 * Uses a single separator if any spaces or separators are present.
 */
type OneSeparatorSpacing = "one"

/**
 * Omits all spaces and separators.
 */
type NoSeparatorSpacing = "none"

type ToKebabCaseOptions = {
    /**
     * How separator spacing should be handled.
     */
    separatorSpacing?:
        | FullSeparatorSpacing
        | ConventionalSeparatorSpacing
        | PreserveSeparatorSpacing
        | OneSeparatorSpacing
        | NoSeparatorSpacing
}

export function toKebabCase(
    text: string,
    { separatorSpacing: mode = "conventional" }: ToKebabCaseOptions = {}
): string {
    const lowercased = text.toLowerCase()

    const replaced = lowercased.replace(/[ -]+/g, run => {
        const dashCount = (run.match(/-/g) || []).length
        const hasSpace = run.includes(" ")

        switch (mode) {
            case "full":
                return "-".repeat(run.length)
            case "conventional":
                return "-".repeat(dashCount + (hasSpace ? 1 : 0))
            case "preserve":
                return "-".repeat(dashCount)
            case "one":
                return "-"
            case "none":
                return ""
        }
    })

    const normalized = replaced.replace(/^-+|-+$/g, "")

    return normalized
}
