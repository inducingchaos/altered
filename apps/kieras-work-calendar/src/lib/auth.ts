import { DateTime } from "luxon"
import { config } from "../config"
import { logger } from "./logger"

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

function calculateTimezoneOffset(): number {
    const now = DateTime.now().setZone(config.app.timezone)

    return -now.offset / 60
}

function buildLoginFormData(credentials: LoginCredentials, tzOffset: number): URLSearchParams {
    const { userId, pin, venueId } = credentials
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

    return formData
}

function extractHiddenField(html: string, fieldName: string): string | null {
    const pattern = new RegExp(`<input[^>]*name=["']${fieldName}["'][^>]*value=["']([^"']+)["']`, "i")
    const match = html.match(pattern)

    return match ? match[1] : null
}

function validateLoginResponse(html: string): void {
    if (html.includes("login_failed") || html.includes("Please enter your User ID and PIN")) {
        logger.error("Login validation failed: Invalid credentials")

        throw new Error("Login failed: Invalid credentials")
    }
}

async function performLoginRequest(formData: URLSearchParams): Promise<string> {
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
        logger.error("Login request failed", { status: response.status, statusText: response.statusText })

        throw new Error(`Login request failed: ${response.status}`)
    }

    return await response.text()
}

export async function login(credentials: LoginCredentials): Promise<SessionInfo> {
    const tzOffset = calculateTimezoneOffset()
    const formData = buildLoginFormData(credentials, tzOffset)
    const html = await performLoginRequest(formData)
    validateLoginResponse(html)

    const sessionKey = extractHiddenField(html, "SessionKey")
    const employeeId = extractHiddenField(html, "EmployeeId")

    if (!sessionKey || !employeeId) {
        logger.error("Login response missing required fields")

        throw new Error("Login succeeded but required fields not found in response")
    }

    const employeeFullName = extractHiddenField(html, "EmployeeFullName") ?? undefined

    logger.info("Login successful")

    return { sessionKey, employeeId, employeeFullName }
}

export async function getFreshSession(): Promise<SessionInfo> {
    return login({
        userId: config.abimm.userId,
        pin: config.abimm.pin,
        venueId: config.abimm.venueId
    })
}
