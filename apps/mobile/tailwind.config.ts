import type { Config } from "tailwindcss"
// @ts-expect-error - no types
import nativewind from "nativewind/preset"

import baseConfig from "@altered/tailwind-config/native"

export default {
    content: ["./src/**/*.{ts,tsx}"],
    presets: [nativewind, baseConfig]
} satisfies Config
