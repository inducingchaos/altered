/**
 *
 */

import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { NavBar } from "./components"
import "./globals.css"

// const hoeflerText = localFont({
//     variable: "--font-hoefler-text",
//     src: [
//         {
//             path: "../../public/typefaces/hoefler-text/regular.ttf",
//             weight: "400",
//             style: "normal"
//         },
//         {
//             path: "../../public/typefaces/hoefler-text/regular-italic.ttf",
//             weight: "400",
//             style: "italic"
//         },
//         {
//             path: "../../public/typefaces/hoefler-text/black.ttf",
//             weight: "900",
//             style: "normal"
//         },
//         {
//             path: "../../public/typefaces/hoefler-text/black-italic.ttf",
//             weight: "900",
//             style: "italic"
//         }
//     ]
// })

/**
 * @remarks Add Hoefler Text if enabled in the future.
 */
const fontVariables = [GeistSans.variable, GeistMono.variable].join(" ")

export const metadata: Metadata = {
    title: "ALTERED | Knowledge Systems For The Obsessed",
    description: "Store, develop, and use your knowledge on the fastest thought-to-action platform to exist."
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${fontVariables} antialiased`}>
                <NavBar />
                {children}
            </body>
        </html>
    )
}
