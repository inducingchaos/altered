# Kiera's Work Calendar

A service that syncs work schedule from ABIMM portal to an iCal subscription feed for iOS Calendar.

## Setup

### 1. Environment Variables

Required credentials:

- **ABIMM_USER_ID**: Your login user ID (e.g., "HUNT8107")
- **ABIMM_PIN**: Your PIN/password
- **ABIMM_VENUE_ID**: `IDH` (optional, defaults to "IDH")
- **REFRESH_SECRET**: A secret string for manual refresh endpoint authentication (generate a random string)
- **QSTASH_TOKEN**: (Optional) Upstash QStash token for scheduled refreshes

**Note**: The app now uses dynamic login - it automatically logs in on each request to get a fresh session key. No need to manually update session keys anymore!

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
    - `ABIMM_USER_ID` (your login user ID)
    - `ABIMM_PIN` (your PIN/password)
    - `ABIMM_VENUE_ID` (optional, defaults to "IDH")
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

1. Automatically logs into the ABIMM portal to get a fresh session key
2. Fetches calendar HTML from the ABIMM portal for current + 2 months
3. Parses events from HTML (dates, times, facilities, addresses)
4. Generates a single ICS file with all events
5. Serves it for iOS Calendar subscription

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

- **Dynamic Login**: The app automatically logs in on each calendar request to get a fresh session key
- No need to manually update session keys - they're fetched dynamically
- The calendar refreshes every 8 hours via QStash (if configured)
- Calendar fetches data for current month + 2 months ahead
