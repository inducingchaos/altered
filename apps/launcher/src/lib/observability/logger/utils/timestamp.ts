/**
 *
 */

export const formatTimestamp = ({ date, include: includeParts }: { date: Date; include?: { date?: boolean; time?: boolean } }) => {
    const { date: includeDate, time: includeTime } = {
        date: true,
        time: true,
        ...includeParts
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    const datePart = includeDate ? `${year}-${month}-${day}` : undefined
    const timePart = includeTime ? `${hours}:${minutes}:${seconds}` : undefined

    return [datePart, timePart].filter(Boolean).join(" ")
}
