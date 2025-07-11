/**
 *
 */

import { Detail } from "@raycast/api"

const info = `
# ALTERED

Welcome to ALTERED.

## Getting Started

1. Capture a thought.
2. Refine your thought if needed.
3. Generate from your ALTERED brain.

`

export default function Info() {
    return <Detail markdown={info} />
}
