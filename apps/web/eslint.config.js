import baseConfig, { restrictEnvAccess } from "@altered/eslint-config/base"
import nextjsConfig from "@altered/eslint-config/nextjs"
import reactConfig from "@altered/eslint-config/react"

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: [".next/**"]
    },
    ...baseConfig,
    ...reactConfig,
    ...nextjsConfig,
    ...restrictEnvAccess
]
