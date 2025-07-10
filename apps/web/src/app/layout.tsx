import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { cn } from "@altered/ui"
import { Toaster } from "@altered/ui/sonner"
import { ThemeProvider, ThemeToggle } from "@altered/ui/theme"

import { TRPCReactProvider } from "~/trpc/react"

import "~/app/globals.css"

import { env } from "~/env"

export const metadata: Metadata = {
    metadataBase: new URL(env.VERCEL_ENV === "production" ? env.NEXT_PUBLIC_PROD_URL : env.NEXT_PUBLIC_BASE_URL),
    title: "ALTERED",
    description: "Knowledge systems for the obsessed.",
    icons: {
        icon: "/icon-rounded.png"
    },
    openGraph: {
        title: "ALTERED",
        description: "Knowledge systems for the obsessed.",
        url: env.VERCEL_ENV === "production" ? env.NEXT_PUBLIC_PROD_URL : env.NEXT_PUBLIC_BASE_URL,
        siteName: "ALTERED"
    },
    twitter: {
        card: "summary_large_image",
        site: "@altered",
        creator: "@altered"
    }
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "hsl(var(--background))" },
        { media: "(prefers-color-scheme: dark)", color: "hsl(var(--background))" }
    ],
    maximumScale: 1
}

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn("bg-background font-sans text-foreground antialiased", GeistSans.variable, GeistMono.variable)}>
                <NuqsAdapter>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <TRPCReactProvider>{props.children}</TRPCReactProvider>
                        <div className="fixed bottom-4 right-4 z-10">
                            <ThemeToggle />
                        </div>

                        <Toaster />
                    </ThemeProvider>
                </NuqsAdapter>
            </body>
        </html>
    )
}
