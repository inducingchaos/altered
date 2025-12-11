/**
 *
 */

import { createPKCEClient } from "./client"

export async function getAccessToken() {
    const client = createPKCEClient()
    const tokenSet = await client.getTokens()

    return tokenSet?.accessToken ?? null
}
