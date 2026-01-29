/**
 *
 */

/**
 * Escapes special characters in a string to prevent unexpected markdown formatting.
 */
export function sanitizeTextForMarkdown(text: string): string {
    const withoutBackslashes = text.replace(/\\/g, "\\\\")

    const withoutBackticks = withoutBackslashes.replace(/`/g, "\\`")

    const withoutAsterisks = withoutBackticks.replace(/\*/g, "\\*")

    const withoutUnderscores = withoutAsterisks.replace(/_/g, "\\_")

    const withoutOpeningBrackets = withoutUnderscores.replace(/\[/g, "\\[")

    const withoutClosingBrackets = withoutOpeningBrackets.replace(/\]/g, "\\]")

    const withoutExclamationMarks = withoutClosingBrackets.replace(/!/g, "\\!")

    const withoutGreaterThan = withoutExclamationMarks.replace(/>/g, "\\>")

    const withoutPipes = withoutGreaterThan.replace(/\|/g, "\\|")

    const withoutTildes = withoutPipes.replace(/~/g, "\\~")

    const withoutHeaders = withoutTildes.replace(/^(#{1,6})\s/gm, "\\$1 ")

    const withoutListMarkers = withoutHeaders.replace(/^([+\-*])\s/gm, "\\$1 ")

    const withoutOrderedListMarkers = withoutListMarkers.replace(
        /^(\d+)\.\s/gm,
        "$1\\. "
    )

    return withoutOrderedListMarkers
}
