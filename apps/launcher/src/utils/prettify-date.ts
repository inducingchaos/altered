/**
 *
 */

import { DateTime } from "luxon"

export const prettifyDate = (date: Date) =>
    DateTime.fromJSDate(date).toLocaleString({
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    })
