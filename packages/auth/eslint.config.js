import baseConfig, { restrictEnvAccess } from "@altered-42/eslint-config/base"

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: []
    },
    ...baseConfig,
    ...restrictEnvAccess
]
