/**
 * Authentication and session management for ABIMM portal
 */

interface LoginCredentials {
    userId: string
    pin: string
    venueId: string
}

interface SessionInfo {
    sessionKey: string
    employeeId: string
    employeeFullName?: string
}

/**
 * Logs into the ABIMM portal and extracts session information
 */
export async function login(credentials: LoginCredentials): Promise<SessionInfo> {
    const { userId, pin, venueId } = credentials

    // Calculate timezone offset (in hours, negative for UTC offset)
    // JavaScript's getTimezoneOffset() returns minutes, positive for behind UTC
    // We need hours, negative for behind UTC (e.g., PST is -8, so offset is 8)
    const tzOffset = Math.round(new Date().getTimezoneOffset() / 60)

    // Build form data for login
    const formData = new URLSearchParams()
    formData.append("APPNAME", "S22")
    formData.append("PRGNAME", "Login_Page")
    formData.append("arguments", "Venue_Id,Action")
    formData.append("Action", "Login")
    formData.append("Venue_Id", venueId)
    formData.append("AccessOverride", "<!$MG_AccessOverride>")
    formData.append("LoginId", userId.toUpperCase())
    formData.append("PIN", pin)
    formData.append("tz_offset_b", String(tzOffset))
    formData.append("tz_offset_s", "<!$MG_SpecifiedTimeZone>")
    formData.append("req_counter_l", "    1")

    const response = await fetch("https://ess.abimm.com/ABIMM_ASP/Request.aspx", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            Referer: "https://ess.abimm.com/ABIMM_ASP/Request.aspx"
        },
        body: formData.toString()
    })

    if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()

    // Check if login was successful by looking for error messages or main menu
    if (html.includes("login_failed") || html.includes("Please enter your User ID and PIN")) {
        throw new Error("Login failed: Invalid credentials or login error")
    }

    // Extract SessionKey from hidden form fields in the response
    // Format: <input type="hidden" name="SessionKey" value="...">
    const sessionKeyMatch = html.match(/<input[^>]*name=["']SessionKey["'][^>]*value=["']([^"']+)["']/i)
    if (!sessionKeyMatch) {
        throw new Error("Login succeeded but SessionKey not found in response")
    }

    const sessionKey = sessionKeyMatch[1]

    // Extract EmployeeId from hidden form fields
    // Format: <input type="hidden" name="EmployeeId" value="...">
    const employeeIdMatch = html.match(/<input[^>]*name=["']EmployeeId["'][^>]*value=["']([^"']+)["']/i)
    if (!employeeIdMatch) {
        throw new Error("Login succeeded but EmployeeId not found in response")
    }

    const employeeId = employeeIdMatch[1]

    // Extract EmployeeFullName if available (optional)
    const employeeFullNameMatch = html.match(/<input[^>]*name=["']EmployeeFullName["'][^>]*value=["']([^"']+)["']/i)
    const employeeFullName = employeeFullNameMatch ? employeeFullNameMatch[1] : undefined

    return {
        sessionKey,
        employeeId,
        employeeFullName
    }
}

/**
 * Gets a fresh session by logging in with credentials from environment variables
 */
export async function getFreshSession(): Promise<SessionInfo> {
    const userId = process.env.ABIMM_USER_ID
    const pin = process.env.ABIMM_PIN
    const venueId = process.env.ABIMM_VENUE_ID || "IDH"

    if (!userId || !pin) {
        throw new Error("Missing required environment variables: ABIMM_USER_ID and ABIMM_PIN")
    }

    return login({ userId, pin, venueId })
}
