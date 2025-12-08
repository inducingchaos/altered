/**
 * Environment scoping utilities for server/client code-splitting
 */

import type { ConfigValue, Environment } from "./types"

/**
 * Filters config values by environment
 */
export function filterByEnvironment<T extends ConfigValue>(
    config: readonly T[],
    environment: Environment
): T[] {
    return config.filter((item) => {
        // If no environment specified, include in both
        if (!item.environment) return true
        return item.environment === environment
    })
}

/**
 * Checks if we're in a server environment
 */
export function isServer(): boolean {
    return typeof globalThis !== "undefined" && typeof (globalThis as any).window === "undefined"
}

/**
 * Checks if we're in a client environment
 */
export function isClient(): boolean {
    return typeof globalThis !== "undefined" && typeof (globalThis as any).window !== "undefined"
}

/**
 * Validates environment access
 */
export function validateEnvironmentAccess<T extends ConfigValue>(
    item: T,
    currentEnvironment: "server" | "client"
): void {
    if (item.environment && item.environment !== currentEnvironment) {
        throw new Error(
            `Config value with keys [${item.keys.join(", ")}] is scoped to "${item.environment}" but accessed from "${currentEnvironment}"`
        )
    }
}

