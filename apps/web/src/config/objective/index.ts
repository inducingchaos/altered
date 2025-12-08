/**
 * Unified configuration using @altered/objective
 * Combines env (server-only), features (both), and localization (client-only)
 */

import { createConfig } from "@altered/objective"
import { z } from "zod"

const envVarInputSchema = z.string().optional()
const envVarStringSchema = envVarInputSchema.pipe(z.string().min(1))
const envVarUrlSchema = envVarInputSchema.pipe(z.url())

export const { get } = createConfig([
    // Environment variables (server-only)
    {
        keys: ["config", "overrides", "environment"] as const,
        environment: "server",
        validator: envVarInputSchema.pipe(z.enum(["development", "preview", "production"])),
        value: process.env.CONFIG_ENV
    },
    {
        keys: ["database", "url"] as const,
        environment: "server",
        validator: envVarUrlSchema,
        value: process.env.DATABASE_URL
    },
    {
        keys: ["auth", "internal", "secret"] as const,
        environment: "server",
        validator: envVarStringSchema,
        value: process.env.AUTH_SECRET
    },
    {
        keys: ["auth", "google", "id"] as const,
        environment: "server",
        validator: envVarStringSchema,
        value: process.env.AUTH_GOOGLE_ID
    },
    {
        keys: ["auth", "google", "secret"] as const,
        environment: "server",
        validator: envVarStringSchema,
        value: process.env.AUTH_GOOGLE_SECRET
    },
    {
        keys: ["system", "environment"] as const,
        environment: "server",
        validator: envVarInputSchema.pipe(z.enum(["development", "production"])),
        value: process.env.NODE_ENV
    },
    {
        keys: ["system", "port"] as const,
        environment: "server",
        validator: envVarStringSchema,
        value: process.env.PORT
    },
    {
        keys: ["system", "vercel", "environment"] as const,
        environment: "server",
        validator: envVarInputSchema.pipe(z.enum(["development", "preview", "production"])),
        value: process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV
    },
    {
        keys: ["system", "vercel", "url"] as const,
        environment: "server",
        validator: envVarStringSchema,
        value: process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL
    },
    {
        keys: ["system", "vercel", "branchUrl"] as const,
        environment: "server",
        validator: envVarStringSchema,
        value: process.env.VERCEL_BRANCH_URL ?? process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
    },
    {
        keys: ["system", "vercel", "productionUrl"] as const,
        environment: "server",
        validator: envVarStringSchema,
        value: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    },
    // Features (both server and client - no environment specified)
    {
        keys: ["features", "testFeature", "flag"] as const,
        validator: z.string(),
        value: "test-feature"
    },
    {
        keys: ["features", "testFeature", "enabled"] as const,
        validator: z.boolean(),
        value: false
    },
    // Localization (client-only)
    {
        keys: ["localization", "identity", "name"] as const,
        environment: "client",
        validator: z.string(),
        value: "ALTERED"
    },
    {
        keys: ["localization", "identity", "description"] as const,
        environment: "client",
        validator: z.string(),
        value: "Knowledge systems for the obsessed."
    }
] as const)
