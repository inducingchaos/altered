/**
 *
 */

import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ThemedText } from "~/components"

export function Splash({ onPress }: { onPress?: () => void }) {
    const insets = useSafeAreaInsets()

    const someCalculation = 64 / 3

    return (
        <View
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 items-center justify-center gap-4"
        >
            {/* Logo. */}

            <ThemedText className="font-hoefler-text text-lg">{"UNKNOWN HARDWARE"}</ThemedText>

            {/* Sign in. */}

            <TouchableOpacity
                onPress={onPress}
                style={{ bottom: insets.bottom + 24, borderRadius: someCalculation, padding: someCalculation }}
                className="absolute h-16 items-center justify-center"
            >
                <ThemedText invert className="font-geist-medium text-sm">
                    {"Continue"}
                </ThemedText>
            </TouchableOpacity>
        </View>
    )
}
