# Kiera's Work Calendar

A service that syncs work schedule from ABIMM portal to an iCal subscription feed for iOS Calendar.

## Setup

### 1. Environment Variables

**Required:**

- `ABIMM_USER_ID` - Login user ID
- `ABIMM_PIN` - Login PIN/password
- `INTERNAL_SECRET` - Secret for manual refresh endpoint authentication

**Optional:**

- `ABIMM_VENUE_ID` - Venue ID (defaults to "IDH")
- `QSTASH_URL` - QStash endpoint URL
- `QSTASH_TOKEN` - QStash authentication token
- `QSTASH_CURRENT_SIGNING_KEY` - QStash current signing key for webhook verification
- `QSTASH_NEXT_SIGNING_KEY` - QStash next signing key for webhook verification
- `ENABLE_LOGGING` - Set to "true" to enable verbose logging
- `CRON_SCHEDULE` - Cron pattern for QStash scheduling (defaults to "0 _/8 _ \* \*")
- `MONTHS_TO_FETCH` - Number of months to fetch ahead (defaults to 3)
- `TIMEZONE` - IANA timezone identifier (defaults to "America/Edmonton")
- `CALENDAR_NAME` - Name of the calendar in ICS file (defaults to "ICE District Authentics Work Schedule")

**Note**: The app uses dynamic login - it automatically authenticates on each request to get a fresh session key.

### 2. Local Development

```bash
pnpm install
cp .env.example .env
# Edit .env with your values
pnpm execute diagnose
pnpm dev
```

### 3. Deploy to Vercel

1. Push to GitHub and connect to Vercel
2. Set environment variables in Vercel dashboard
3. Vercel will automatically detect Elysia and deploy

### 4. Subscribe to Calendar

1. Get your calendar URL: `https://your-app.vercel.app/calendar.ics`
2. In iOS Calendar: Settings > Calendars > Add Calendar > Add Subscription Calendar
3. Paste the URL

## How it works

1. Automatically logs into the ABIMM portal to get a fresh session key
2. Fetches calendar HTML for current + N months ahead
3. Parses events from HTML (dates, times, facilities, addresses)
4. Generates a single ICS file with all events
5. Serves it for iOS Calendar subscription

## Scripts

- `pnpm dev` - Run development server
- `pnpm execute diagnose` - Test calendar fetching
- `pnpm execute diagnose --json` - Output events as JSON
- `pnpm execute diagnose --output-ics` - Save ICS file
- `pnpm execute validate-ics [path]` - Validate ICS file
- `pnpm typecheck` - Type check

## Manual Refresh

```bash
curl -X GET https://your-app.vercel.app/api/refresh \
  -H "X-Refresh-Secret: your-internal-secret"
```

## Configuration

Set `ENABLE_LOGGING=true` to enable verbose logging. Adjust `CRON_SCHEDULE` to change refresh frequency.
