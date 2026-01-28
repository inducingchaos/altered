/**
 *
 */

type DateFormatPresetID = "compact"

const formatters = {
    compact: new Intl.DateTimeFormat(undefined, {
        dateStyle: "short",
        timeStyle: "short",
        hour12: false
    })
} satisfies Record<DateFormatPresetID, Intl.DateTimeFormat>

export function formatDate(
    date: Date,
    options: { preset: DateFormatPresetID }
): string {
    return formatters[options.preset].format(date)
}
