/**
 *
 */

import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { QueryClientProvider } from "@tanstack/react-query"

import { queryClient } from "~/utils/api"

import "~/utils/polyfills"
import "../styles.ios"

import { Splash } from "~/components/splash"
import { useLoadedFonts } from "~/hooks/use-loaded-fonts"
import { authClient } from "~/utils/auth"

export default function RootLayout() {
    const { isLoaded } = useLoadedFonts()

    if (!isLoaded) return null

    return (
        <QueryClientProvider client={queryClient}>
            <AuthLayer>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </AuthLayer>
            <StatusBar />
        </QueryClientProvider>
    )
}

function AuthLayer({ children }: { children: React.ReactNode }) {
    const { data: session } = authClient.useSession()
    const signIn = authClient.useSignIn()

    if (!session) return <Splash onPress={() => signIn(options => options.social({ provider: "google" }))} />

    return children
}
