/**
 *
 */

import { showHUD } from "@raycast/api"
import { getAccessToken } from "@raycast/utils"
import { withAuthentication } from "./lib/auth"

async function runScriptCommand() {
    const { token } = getAccessToken()

    //  Instead, get API or auth data here.

    await showHUD(token.substring(0, 8) + "...")
}

export default withAuthentication(runScriptCommand)
