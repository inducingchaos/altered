/**
 *
 */

import { Viewport } from "next"

/**
 * @todo [P3] Review this viewport config.
 */
export const viewport: Viewport = {
    colorScheme: "dark",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" }
    ]
}
