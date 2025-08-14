/**
 *
 */

export type EnvironmentConfig = {
    mode: "production" | "development"
    baseUrl: {
        development: string
        production: string
    }
}
