import baseConfig from "@altered/eslint-config/base"
import reactConfig from "@altered/eslint-config/react"

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: ["dist/**"]
    },
    ...baseConfig,
    ...reactConfig
]
