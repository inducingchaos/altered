/**
 *
 */

interface FetchCalendarParams {
    sessionKey: string
    employeeId: string
    venueId: string
    calendarMonth: string
}

function buildCalendarFormData(params: FetchCalendarParams): FormData {
    const { sessionKey, employeeId, venueId, calendarMonth } = params
    const formData = new FormData()

    formData.append("appname", "S22")
    formData.append("prgname", "WebCalendar")
    formData.append("arguments", "EmployeeId,CalendarMonth,Action,Venue_Id")
    formData.append("Action", "C")
    formData.append("EmployeeId", employeeId)
    formData.append("SessionKey", sessionKey)
    formData.append("CalendarMonth", calendarMonth)
    formData.append("Venue_Id", venueId)

    return formData
}

export async function fetchCalendarData(params: FetchCalendarParams): Promise<string> {
    const formData = buildCalendarFormData(params)

    const response = await fetch("https://ess.abimm.com/ABIMM_ASP/Request.aspx", {
        method: "POST",
        body: formData,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            Referer: "https://ess.abimm.com/ABIMM_ASP/Request.aspx"
        }
    })

    if (!response.ok) {
        const error = new Error(`Calendar fetch failed: ${response.status}`)

        throw error
    }

    return await response.text()
}
