/**
 *
 */

import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import localFont from "next/font/local"

export const pxGrotesk = localFont({
    src: [
        {
            path: "../../../../public/typefaces/px-grotesk-trial-thin.otf",
            weight: "100",
            style: "normal"
        },
        {
            path: "../../../../public/typefaces/px-grotesk-trial-thin-italic.otf",
            weight: "100",
            style: "italic"
        },

        {
            path: "../../../../public/typefaces/px-grotesk-light.woff2",
            weight: "300",
            style: "normal"
        },
        // {
        //     path: "../../../../public/typefaces/px-grotesk-trial-light-italic.otf",
        //     weight: "300",
        //     style: "italic"
        // },

        {
            path: "../../../../public/typefaces/px-grotesk-regular.otf",
            weight: "400",
            style: "normal"
        },
        // {
        //     path: "../../../../public/typefaces/px-grotesk-trial-regular-italic.otf",
        //     weight: "400",
        //     style: "italic"
        // },

        {
            path: "../../../../public/typefaces/px-grotesk-bold.otf",
            weight: "700",
            style: "normal"
        },
        // {
        //     path: "../../../../public/typefaces/px-grotesk-trial-bold-italic.otf",
        //     weight: "700",
        //     style: "italic"
        // },

        {
            path: "../../../../public/typefaces/px-grotesk-trial-black.otf",
            weight: "900",
            style: "normal"
        },
        {
            path: "../../../../public/typefaces/px-grotesk-trial-black-italic.otf",
            weight: "900",
            style: "italic"
        }
    ],
    variable: "--font-px-grotesk"
})

export const pxGroteskMono = localFont({
    src: [
        {
            path: "../../../../public/typefaces/px-grotesk-mono-trial-light.otf",
            weight: "300",
            style: "normal"
        },
        {
            path: "../../../../public/typefaces/px-grotesk-mono-trial-light-italic.otf",
            weight: "300",
            style: "italic"
        },

        {
            path: "../../../../public/typefaces/px-grotesk-mono-regular.otf",
            weight: "400",
            style: "normal"
        }
        // {
        //     path: "../../../../public/typefaces/px-grotesk-mono-trial-regular-italic.otf",
        //     weight: "400",
        //     style: "italic"
        // },

        // {
        //     path: "../../../../public/typefaces/px-grotesk-mono-trial-bold.otf",
        //     weight: "700",
        //     style: "normal"
        // },
        // {
        //     path: "../../../../public/typefaces/px-grotesk-mono-trial-bold-italic.otf",
        //     weight: "700",
        //     style: "italic"
        // }
    ],
    variable: "--font-px-grotesk-mono"
})

export const pxGroteskScreen = localFont({
    src: "../../../../public/typefaces/px-grotesk-screen-regular.otf",
    variable: "--font-px-grotesk-screen"
})

/**
 * @todo [P3] Re-evaluate if we need this font once the MVP is done.
 */
const hoeflerText = localFont({
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
    ],
    variable: "--font-hoefler-text"
})

export const fontVariables = [GeistSans.variable, GeistMono.variable, hoeflerText.variable, pxGrotesk.variable, pxGroteskMono.variable, pxGroteskScreen.variable].join(" ")
