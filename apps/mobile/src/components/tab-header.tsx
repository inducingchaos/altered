/**
 *
 */
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { useAssets } from "expo-asset"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"

import { useLayoutDimensions } from "~/hooks"
import { ThemedText } from "./themed-text"

export function TabHeader({
    options,
    profilePicture: _ProfilePicture
}: BottomTabHeaderProps & { profilePicture: { size?: number; onPress: () => void } }) {
    const profilePicture = { size: _ProfilePicture.size ?? 40, onPress: _ProfilePicture.onPress }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const [assets] = useAssets([require("../../assets/examples/pfp.jpg")])
    const { system, header } = useLayoutDimensions()

    return (
        <View
            style={{
                minHeight: header.height
            }}
            className="absolute left-0 right-0 top-0 w-full"
        >
            <BlurView
                intensity={64}
                style={{ paddingTop: system.insets.top + 16 }}
                className="flex-1 flex-row items-end justify-between px-6 py-4"
            >
                <ThemedText className="text-lg">{options.title}</ThemedText>
                <TouchableOpacity onPress={profilePicture.onPress}>
                    <View>
                        <Image
                            source={assets?.[0] ?? "https://i.pravatar.cc/300"}
                            style={{
                                width: profilePicture.size,
                                height: profilePicture.size,
                                borderRadius: profilePicture.size / 3
                            }}
                        />

                        {/* Inner border. */}

                        <View style={{ borderRadius: profilePicture.size / 3 }} className="absolute inset-0 border-2" />
                    </View>
                </TouchableOpacity>
            </BlurView>

            {/* Inner bottom border. */}

            <View className="absolute bottom-0 left-0 right-0 border-b-2" />
        </View>
    )
}
