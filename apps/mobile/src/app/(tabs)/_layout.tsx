/**
 *
 */

import type { SymbolViewProps } from "expo-symbols"
import React from "react"
import { Tabs } from "expo-router"

import { IconSymbol, TabBar, TabHeader } from "~/components"
import { useLogoutDialog } from "~/hooks"

interface TabConfig {
    name: string
    title: string
    icon: SymbolViewProps["name"]
}

const tabConfig = [{ name: "index", title: "Home", icon: "house" }] satisfies TabConfig[]

export default function TabLayout() {
    const logoutDialog = useLogoutDialog()

    return (
        <Tabs
            screenOptions={{
                header: props => <TabHeader profilePicture={{ onPress: logoutDialog.show }} {...props} />
            }}
            tabBar={props => <TabBar {...props} />}
        >
            {tabConfig.map(({ name, title, icon }) => (
                <Tabs.Screen
                    key={name}
                    name={name}
                    options={{
                        title,
                        tabBarIcon: ({ focused, size }) => (
                            <IconSymbol name={icon} style={{ width: size, height: size }} className={`${focused ? "" : ""}`} />
                        )
                    }}
                />
            ))}
        </Tabs>
    )
}
