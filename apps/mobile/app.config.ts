/**
 *
 */

import type { ConfigContext, ExpoConfig } from "expo/config"

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "ALTERED",
    slug: "altered",
    scheme: "altered",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    updates: { fallbackToCacheTimeout: 0 },
    assetBundlePatterns: ["**/*"],
    ios: {
        bundleIdentifier: "com.splitdesigns.altered",
        // supportsTablet: true,
        icon: {
            light: "./assets/icon.png"
            // dark: "./assets/icon.png"
            // tinted: "",
        }
    },
    android: {
        package: "com.splitdesigns.altered",
        adaptiveIcon: {
            foregroundImage: "./assets/icon.png",
            backgroundColor: "#FFFFFF"
        }
    },
    // extra: {
    //     eas: {
    //         projectId: "your-eas-project-id"
    //     }
    // },
    experiments: {
        tsconfigPaths: true,
        typedRoutes: true
    },
    plugins: [
        "expo-router",
        "expo-asset",
        "expo-secure-store",
        "expo-web-browser",
        [
            "expo-splash-screen",
            {
                backgroundColor: "#FFFFFF",
                // image: "./assets/icon.png",
                dark: {
                    backgroundColor: "#FFFFFF"
                    // image: "./assets/icon.png"
                }
            }
        ]
    ],
    newArchEnabled: true
})
