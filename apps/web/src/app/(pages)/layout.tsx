/**
 *
 */

import { ReactNode } from "react"
import "~/app/globals.css"
import { ContextProvider } from "~/components/headless"
import { Toaster } from "~/components/ui/primitives/sonner"
import "~/lib/infra/rpc/pre-render"
import { NavBar } from "./_components"
import { fontVariables } from "./_config/fonts"

export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${fontVariables} antialiased`}>
                <ContextProvider>
                    <NavBar />
                    {children}
                    <Toaster position="top-center" />
                </ContextProvider>
            </body>
        </html>
    )
}

export { metadata } from "./_config/metadata/layout"
export { viewport } from "./_config/viewport/layout"
