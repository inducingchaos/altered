# Kiera's Work Calendar

A service that syncs work schedule from ABIMM portal to an iCal subscription feed for iOS Calendar.

## Setup

### 1. Environment Variables

From the HAR file (`ess.abimm.com.har`), the credentials are:

- **ABIMM_SESSION_KEY**: `jcAvjkhiMA0c0cisv9Htyw73Dd8rR6jgWRhyeSSAXUgQ4YKgQ2EKcb2vWFq6lqPGZLEivsEUhEMdHp7fKSYQ0P4vOvSXkMYp5YrkSklgwklVGYep8BuJP7GAPJJ8QpsL`
- **ABIMM_EMPLOYEE_ID**: `000858107`
- **ABIMM_VENUE_ID**: `IDH` (optional, defaults to "IDH")
- **REFRESH_SECRET**: A secret string for manual refresh endpoint authentication (generate a random string)
- **QSTASH_TOKEN**: (Optional) Upstash QStash token for scheduled refreshes

**Note**: Session keys expire after ~30 minutes of inactivity. You'll need to refresh the `ABIMM_SESSION_KEY` periodically by:

1. Logging into the portal
2. Opening browser dev tools → Network tab
3. Viewing the calendar page
4. Finding the `SessionKey` parameter in the form data of the POST request to `Request.aspx`

### 2. Local Development

```bash
# Install dependencies
pnpm install

# Create .env file with credentials
cp .env.example .env
# Edit .env with your values

# Run diagnostics to test
pnpm execute diagnose

# Run locally
pnpm dev

# The app will run on http://localhost:3000
# Test endpoints:
# - http://localhost:3000/calendar.ics
# - http://localhost:3000/api/refresh (with X-Refresh-Secret header)
```

### 3. Deploy to Vercel

1. Push to GitHub and connect to Vercel
2. Set environment variables in Vercel dashboard:
    - `ABIMM_SESSION_KEY`
    - `ABIMM_EMPLOYEE_ID`
    - `ABIMM_VENUE_ID` (optional)
    - `REFRESH_SECRET` (for manual refresh endpoint)
    - `QSTASH_TOKEN` (optional, for QStash scheduling)

3. Vercel will automatically detect Elysia and deploy

### 4. Subscribe to Calendar

1. Get your calendar URL: `https://your-app.vercel.app/calendar.ics`
2. In iOS Calendar app:
    - Settings > Calendars > Add Calendar > Add Subscription Calendar
    - Paste the URL
    - The calendar will auto-refresh daily

## How it works

- **`/calendar.ics`**: Serves the aggregated calendar file (subscription endpoint)
- **`/api/refresh`**: Manual refresh endpoint (requires `X-Refresh-Secret` header)
- **QStash** (Optional): Scheduled refreshes every 8 hours via Upstash QStash

The service:

1. Fetches calendar HTML from the ABIMM portal for current + 2 months
2. Parses events from HTML (dates, times, facilities, addresses)
3. Generates a single ICS file with all events
4. Serves it for iOS Calendar subscription

## Scripts

- `pnpm dev` - Run development server
- `pnpm execute diagnose` - Run diagnostic script to test calendar fetching
- `pnpm execute diagnose --json` - Output events as JSON file
- `pnpm execute diagnose --output-ics` - Save ICS file for validation
- `pnpm execute validate-ics [path]` - Validate and inspect an ICS file
- `pnpm typecheck` - Type check without building

## Manual Refresh

To manually trigger a calendar refresh:

```bash
curl -X GET https://your-app.vercel.app/api/refresh \
  -H "X-Refresh-Secret: your-refresh-secret"
```

## Notes

- Session keys expire after ~30 minutes of inactivity
- You may need to refresh the session key periodically
- The calendar refreshes every 8 hours via QStash (if configured)
- Calendar fetches data for current month + 2 months ahead
- TODO: Implement dynamic login flow to automatically refresh session keys
