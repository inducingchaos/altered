/**
 * @todo [P4] Move to a separate package or folder?
 */

import { urlAlphabet } from "nanoid"

export function isNanoid(id: string, options?: { alphabet?: string; length?: number }): boolean {
    const { alphabet = urlAlphabet, length = 21 } = options ?? {}

    return new RegExp(`^[${alphabet}]{${length}}$`).test(id)
}
