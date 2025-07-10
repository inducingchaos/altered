import baseConfig, { restrictEnvAccess } from "@altered/eslint-config/base"

/** @type {import('typescript-eslint').Config} */
export default [
    {
        ignores: []
    },
    ...baseConfig,
    ...restrictEnvAccess
]
