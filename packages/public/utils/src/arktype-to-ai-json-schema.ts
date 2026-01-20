/**
 *
 */

import { jsonSchema } from "ai"
import type { type } from "arktype"

export function arktypeToAiJsonSchema<
    Schema extends type.Any = type.Any,
    Output = Schema["infer"]
>(type: Schema) {
    return jsonSchema<Output>(type.toJsonSchema() as never)
}
