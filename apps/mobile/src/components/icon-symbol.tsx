/**
 * This file is a fallback for using MaterialIcons on Android and web.
 */

import type { SymbolViewProps } from "expo-symbols"
import type { ComponentProps } from "react"
import type { StyleProp, TextStyle } from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { cssInterop } from "nativewind"

/**
 * Add your SFSymbol to MaterialIcons mappings here.
 *
 * @see https://icons.expo.fyi
 * @see https://developer.apple.com/sf-symbols
 */
const MAPPING = {
    "chevron.right": "chevron-right"
} as const satisfies Partial<Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>>

export type IconSymbolName = keyof typeof MAPPING

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
    name,
    style,
    className
}: {
    name: IconSymbolName
    style?: StyleProp<TextStyle>
    className?: string
}) {
    const StyledMaterialIcons = cssInterop(MaterialIcons, {
        className: {
            target: "style",
            nativeStyleToProp: {
                color: "color",
                fontSize: "size"
            }
        }
    })

    const mappedName = MAPPING[name]
    if (!(mappedName in MAPPING)) throw new Error(`No mapping found for icon name: ${name}`)

    return <StyledMaterialIcons name={mappedName} style={style} className={className} />
}
