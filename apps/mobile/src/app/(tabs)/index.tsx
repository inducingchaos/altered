/**
 *
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useQuery } from "@tanstack/react-query"

import { trpc } from "~/utils/api"

export default function Home() {
    const insets = useSafeAreaInsets()

    const experimentalQuery = useQuery(trpc.experimental.nanoid.queryOptions({ length: 4 }))

    const handlePress = () => {
        void experimentalQuery.refetch()
    }

    return (
        <View className="flex-1 items-center justify-center" style={{ paddingTop: insets.top }}>
            <View className="gap-1 p-4">
                <Text className="text-sm font-bold">{"Hello, World!"}</Text>

                <Text className="text-md text-center">{"Lorem ipsum."}</Text>
            </View>

            <Pressable onPress={handlePress} className="px-4 py-0.5 active:opacity-50">
                <Text className="font-geist-mono-medium p-1 text-center text-sm">
                    <Text className="font-geist-mono-bold">{"Nanoid: "}</Text>

                    {experimentalQuery.isFetching
                        ? "Loading..."
                        : experimentalQuery.error
                          ? `Error!`
                          : (experimentalQuery.data?.value ?? "Undefined")}
                </Text>
            </Pressable>
        </View>
    )
}
