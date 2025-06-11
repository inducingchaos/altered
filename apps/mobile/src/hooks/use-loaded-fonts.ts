/**
 *
 */

import { useEffect } from "react"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

/**
 * Helper for safely loading custom fonts.
 */
export function useLoadedFonts() {
    //  Prevents the splash screen from hiding before the fonts are loaded.

    void SplashScreen.preventAutoHideAsync()

    const [isLoaded, error] = useFonts({
        //  Geist.

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        geist: require("~/assets/typefaces/geist-regular.otf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "geist-medium": require("~/assets/typefaces/geist-medium.otf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "geist-semibold": require("~/assets/typefaces/geist-semibold.otf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "geist-bold": require("~/assets/typefaces/geist-bold.otf"),

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "geist-mono": require("~/assets/typefaces/geist-mono-regular.otf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "geist-mono-medium": require("~/assets/typefaces/geist-mono-medium.otf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "geist-mono-semibold": require("~/assets/typefaces/geist-mono-semibold.otf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "geist-mono-bold": require("~/assets/typefaces/geist-mono-bold.otf"),

        //  Hoefler Text.

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "hoefler-text": require("~/assets/typefaces/hoefler-text-regular.ttf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "hoefler-text-italic": require("~/assets/typefaces/hoefler-text-regular-italic.ttf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "hoefler-text-black": require("~/assets/typefaces/hoefler-text-black.ttf"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        "hoefler-text-black-italic": require("~/assets/typefaces/hoefler-text-black-italic.ttf")
    })

    useEffect(() => {
        if (isLoaded || error) void SplashScreen.hideAsync()
    }, [isLoaded, error])

    return {
        isLoaded,
        error
    }
}
