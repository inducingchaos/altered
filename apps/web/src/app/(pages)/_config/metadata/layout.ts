/**
 *
 */

import { Metadata } from "next"
import { application, localization } from "~/config"

/**
 * @todo [P3] Review all metadata values.
 */
export const metadata: Metadata = {
    metadataBase: application.locations.origins.current,
    title: {
        default: localization.identity.name,
        template: `%s | ${localization.identity.name}`
    },
    description: localization.identity.description,
    applicationName: localization.identity.name,
    referrer: "origin-when-cross-origin",

    /**
     * @todo [P3] Replace this icon.
     */
    icons: "/icon.png"
}
