import { fileURLToPath } from "url"
import createJiti from "jiti"

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env")

/** @type {import("next").NextConfig} */
const config = {
    /** Enables hot reloading for local packages without a build step */
    transpilePackages: ["@altered-42/api", "@altered-42/auth", "@altered-42/db", "@altered-42/ui", "@altered-42/validators"],

    /** We already do linting and typechecking as separate tasks in CI */
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },

    allowedDevOrigins: ["superb-chamois-stirring.ngrok-free.app"]
}

export default config
