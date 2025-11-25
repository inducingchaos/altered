/**
 *
 */

import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import localFont from "next/font/local"

/**
 * @todo [P3] Re-evaluate if we need this font once the MVP is done.
 */
const hoeflerText = localFont({
    variable: "--font-hoefler-text",
    src: [
        {
            path: "../../../../public/typefaces/hoefler-text/regular.ttf",
            weight: "400",
            style: "normal"
        },
        {
            path: "../../../../public/typefaces/hoefler-text/regular-italic.ttf",
            weight: "400",
            style: "italic"
        },
        {
            path: "../../../../public/typefaces/hoefler-text/black.ttf",
            weight: "900",
            style: "normal"
        },
        {
            path: "../../../../public/typefaces/hoefler-text/black-italic.ttf",
            weight: "900",
            style: "italic"
        }
    ]
})

export const fontVariables = [GeistSans.variable, GeistMono.variable, hoeflerText.variable].join(" ")
