import baseConfig, { restrictEnvAccess } from "@altered-42/eslint-config/base"
import nextjsConfig from "@altered-42/eslint-config/nextjs"
import reactConfig from "@altered-42/eslint-config/react"

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
