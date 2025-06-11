/**
 *
 */

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from "expo-blur"
import * as Haptics from "expo-haptics"

export function TabBar({
    iconSize = 24,
    height = 64,
    blurRadius = 64,
    expand = false,
    ...props
}: BottomTabBarProps & { iconSize?: number; height?: number; blurRadius?: number; expand?: boolean }) {
    const insets = useSafeAreaInsets()

    const borderRadius = Math.round(height / 3)
    const iconSpacing = (height - iconSize) / 2

    return (
        <>
            {/* Safe area inset & positioning. */}

            <View
                style={{ paddingBottom: insets.bottom, paddingHorizontal: iconSpacing }}
                className={"absolute bottom-0 left-0 right-0 items-center"}
            >
                {/* Tab bar container. */}

                <View style={{ height, borderRadius, width: expand ? "100%" : "auto" }} className="w-full overflow-hidden">
                    {/* Backdrop blur. */}

                    <BlurView intensity={blurRadius} className="absolute inset-0" />

                    {/* Inner border. */}

                    <View style={{ borderRadius }} className="absolute inset-0 border-2" />

                    {/* Tab container. */}

                    <View style={{ paddingHorizontal: iconSpacing }} className="flex-1 flex-row items-center justify-evenly">
                        {props.state.routes.map((route, index) => {
                            const { tabBarIcon, tabBarAccessibilityLabel } = props.descriptors[route.key]?.options ?? {}

                            const isFocused = props.state.index === index

                            const handlePress = () => {
                                //  Trigger haptics.

                                // eslint-disable-next-line turbo/no-undeclared-env-vars
                                if (process.env.EXPO_OS === "ios") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

                                //  Create the navigation event.

                                const event = props.navigation.emit({
                                    type: "tabPress",
                                    target: route.key,
                                    canPreventDefault: true
                                })

                                //  Navigate to the pressed tab.

                                if (!isFocused && !event.defaultPrevented) props.navigation.navigate(route.name)
                            }

                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    style={{ width: iconSize + iconSpacing }}
                                    className="items-center justify-center"
                                    onPress={handlePress}
                                    activeOpacity={0.5}
                                    accessibilityRole="button"
                                    accessibilityState={isFocused ? { selected: true } : {}}
                                    accessibilityLabel={tabBarAccessibilityLabel}
                                >
                                    {tabBarIcon?.({
                                        focused: isFocused,
                                        size: iconSize,

                                        //  Intentionally dysfunctional.

                                        color: "red"
                                    })}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </View>
        </>
    )
}
