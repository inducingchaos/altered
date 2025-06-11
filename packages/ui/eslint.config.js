import baseConfig from "@altered-42/eslint-config/base"
import reactConfig from "@altered-42/eslint-config/react"

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: ["dist/**"]
    },
    ...baseConfig,
    ...reactConfig
]
