/**
 * Fetches calendar HTML from the ABIMM portal
 */

interface FetchCalendarParams {
    sessionKey: string
    employeeId: string
    venueId: string
    calendarMonth: string // Format: YYYYMMDD
}

export async function fetchCalendarData(params: FetchCalendarParams): Promise<string> {
    const { sessionKey, employeeId, venueId, calendarMonth } = params

    const formData = new FormData()
    formData.append("appname", "S22")
    formData.append("prgname", "WebCalendar")
    formData.append("arguments", "EmployeeId,CalendarMonth,Action,Venue_Id")
    formData.append("Action", "C") // C for Calendar view
    formData.append("EmployeeId", employeeId)
    formData.append("SessionKey", sessionKey)
    formData.append("CalendarMonth", calendarMonth)
    formData.append("Venue_Id", venueId)

    const response = await fetch("https://ess.abimm.com/ABIMM_ASP/Request.aspx", {
        method: "POST",
        body: formData,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            Referer: "https://ess.abimm.com/ABIMM_ASP/Request.aspx"
        }
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}`)
    }

    return await response.text()
}
