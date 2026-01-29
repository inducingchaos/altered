/**
 *
 */

/**
 * @remarks We don't have enough context yet to properly name the formatters, so we're using a numeric ID.
 */
type FormatterID = `${0 | 1 | 2}`

const formatters = {
    "0": new Intl.DateTimeFormat(undefined, {
        dateStyle: "short",
        timeStyle: "short"
    }),
    "1": new Intl.DateTimeFormat(undefined, {
        dateStyle: "long"
    }),
    "2": new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short"
    })
} satisfies Record<FormatterID, Intl.DateTimeFormat>

/**
 * @remarks Not enough context to name properly.
 */
type DateFormatPreset = "a" | "b"

export function formatDate(
    date: Date,
    options: { preset: DateFormatPreset }
): string {
    if (options.preset === "b") {
        return `${formatters["1"].format(date)} at ${formatters["2"].format(date)}`
    }

    return formatters["0"].format(date)
}
