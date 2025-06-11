/**
 *
 */

import { Text } from "react-native"

export function ThemedText({
    children,
    className,
    invert
}: {
    children: React.ReactNode
    className?: string
    invert?: boolean
}) {
    const colors = invert ? "" : ""

    return <Text className={`${colors} ${className}`}>{children}</Text>
}
