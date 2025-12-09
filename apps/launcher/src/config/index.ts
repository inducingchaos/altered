/**
 *
 */

import { ConfigDef, configSchema } from "./schema"

const configDef: ConfigDef = {
    environment: "development",

    developmentBaseUrl: "http://localhost:258",
    productionBaseUrl: "https://altered.app"
}

export const config = configSchema.parse(configDef)
