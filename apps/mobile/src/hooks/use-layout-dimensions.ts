/**
 *
 */

import { useEffect, useState } from "react"
import { Keyboard } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export function useLayoutDimensions() {
    const insets = useSafeAreaInsets()
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", e => setKeyboardHeight(e.endCoordinates.height))
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardHeight(0))

        return () => {
            showSubscription.remove()
            hideSubscription.remove()
        }
    }, [])

    return {
        system: {
            insets,
            keyboard: {
                height: keyboardHeight
            }
        },
        header: {
            height: insets.top + 16 + 40 + 16
        }
    }
}
