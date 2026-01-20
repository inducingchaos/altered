/**
 *
 */

import { type ENVConfig, envSchema } from "./schema"

const envConfig: ENVConfig = {
    config: {
        overrides: {
            environment: process.env.CONFIG_ENV
        }
    },
    database: {
        url: process.env.DATABASE_URL
    },
    auth: {
        internal: {
            secret: process.env.AUTH_SECRET
        },

        google: {
            id: process.env.AUTH_GOOGLE_ID,
            secret: process.env.AUTH_GOOGLE_SECRET
        }
    },
    api: {
        clientVersion: "0.1.0"
    },
    providers: {
        openrouter: {
            secret: process.env.PROVIDER_OPENROUTER_SECRET
        }
    },
    system: {
        environment: process.env.NODE_ENV,
        port: process.env.PORT,

        //  @todo [P2] Separate the client/server variables, or adjust so 1) secrets aren't leaked to the server, and 2) the schema input/output types respect what's available to the client.

        vercel: {
            environment:
                process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV,
            url: process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL,
            branchUrl:
                process.env.VERCEL_BRANCH_URL ??
                process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
            productionUrl:
                process.env.VERCEL_PROJECT_PRODUCTION_URL ??
                process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
        }
    }
}

export const env = envSchema.parse({ ...process.env, ...envConfig })
