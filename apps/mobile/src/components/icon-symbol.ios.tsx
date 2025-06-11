/**
 *
 */

import type { SymbolViewProps } from "expo-symbols"
import type { StyleProp, ViewStyle } from "react-native"
import { SymbolView } from "expo-symbols"
import { cssInterop } from "nativewind"

/**
 * @todo [P4] Use `cn` to combine default styles.
 */
export function IconSymbol({
    name,
    style,
    className
}: {
    name: SymbolViewProps["name"]
    style?: StyleProp<ViewStyle>
    className?: string
}) {
    const StyledSymbolView = cssInterop(SymbolView, {
        className: {
            target: "style",
            nativeStyleToProp: {
                color: "tintColor",
                fontWeight: "weight"
            }
        }
    })

    return <StyledSymbolView name={name} resizeMode="scaleAspectFit" style={style} className={className} />
}
