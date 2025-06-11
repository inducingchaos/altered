/**
 *
 */

import type { Config } from "tailwindcss"

import base from "./base"
import { fontFamily } from "./src/config/native"

export default {
    darkMode: "class",
    content: base.content,
    presets: [base],
    theme: {
        fontFamily,

        extend: {}
    }
} satisfies Config
