/**
 *
 */

export function getBaseUrl({ environment }: { environment?: "prod" | "dev" } = {}) {
    if (environment === "dev") return "https://wrkkgc19-5873.usw2.devtunnels.ms"

    return "https://altered.app"
}
