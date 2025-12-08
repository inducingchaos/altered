So the auth (at the moment) 100% worked. Simply a matter of cleaning up, pushing, deploying, cleaning up edge cases.

Was considering using Redis to store prefs but most can be static ENV vars.

Also - should look into how ICS files are actually consumed by iOS - we may not need to refresh it at all. Since it's serverless it may be regenerated every time it's fetched. That's probably the case.

However to save compute ideally you'd save the ICS to a blob storage and just serve it from a CDN, using SWR to regenerate it.

Also: telling AI to make the code more elegant/refactor was a W, it did a really nice job.

Current state: see the DELETE_PROGRESS_REF for files that have been manually reviewed.
