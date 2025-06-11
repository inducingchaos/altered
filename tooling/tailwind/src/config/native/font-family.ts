/**
 *
 */

import type { ThemeConfig } from "tailwindcss/types/config"
import defaultTheme from "tailwindcss/defaultTheme"

export const fontFamily = {
    //  Base. For whatever reason, overriding the standard "sans", "mono", and "serif" classes doesn't work - so we add a suffix. Kind of useless though because they lack support for using weights.

    "sans-custom": ["geist", ...defaultTheme.fontFamily.sans],
    "mono-custom": ["geist-mono", ...defaultTheme.fontFamily.mono],
    "serif-custom": ["hoefler-text", ...defaultTheme.fontFamily.serif],

    // Geist.

    geist: ["geist", ...defaultTheme.fontFamily.sans],
    "geist-medium": ["geist-medium", ...defaultTheme.fontFamily.sans],
    "geist-semibold": ["geist-semibold", ...defaultTheme.fontFamily.sans],
    "geist-bold": ["geist-bold", ...defaultTheme.fontFamily.sans],

    "geist-mono": ["geist-mono", ...defaultTheme.fontFamily.mono],
    "geist-mono-medium": ["geist-mono-medium", ...defaultTheme.fontFamily.mono],
    "geist-mono-semibold": ["geist-mono-semibold", ...defaultTheme.fontFamily.mono],
    "geist-mono-bold": ["geist-mono-bold", ...defaultTheme.fontFamily.mono],

    // Hoefler Text.

    "hoefler-text": ["hoefler-text", ...defaultTheme.fontFamily.serif],
    "hoefler-text-italic": ["hoefler-text-italic", ...defaultTheme.fontFamily.serif],
    "hoefler-text-black": ["hoefler-text-black", ...defaultTheme.fontFamily.serif],
    "hoefler-text-black-italic": ["hoefler-text-black-italic", ...defaultTheme.fontFamily.serif]
} satisfies ThemeConfig["fontFamily"]
