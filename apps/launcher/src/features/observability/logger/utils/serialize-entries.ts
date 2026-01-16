/**
 *
 */

export const serializeDataEntries = ({
    data
}: {
    data: Record<string, unknown>
}) =>
    Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (
                value == null ||
                typeof value === "string" ||
                typeof value === "number" ||
                typeof value === "boolean"
            )
                return [key, value]

            try {
                return [key, JSON.stringify(value)]
            } catch {
                return [key, String(value)]
            }
        })
    )
