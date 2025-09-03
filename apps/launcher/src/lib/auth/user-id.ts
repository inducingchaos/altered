/**
 *
 */

import { getPreferenceValues } from "@raycast/api"

/**
 * @todo [P1] Replace when proper auth endpoints are implemented.
 */
export const { "user-id": userId }: { "user-id": string } = getPreferenceValues()
