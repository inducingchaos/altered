/**
 * @todo [P4] Move to a separate package or folder?
 */

import { urlAlphabet } from "nanoid"

export function isNanoid(id: string, options?: { alphabet?: string; length?: number }): boolean {
    const { alphabet = urlAlphabet, length = 21 } = options ?? {}

    /**
     * @remarks Escapes characters that could cause regex errors.
     */
    const escapedAlphabet = alphabet.replace(/[\]\\^-]/g, "\\$&")

    return new RegExp(`^[${escapedAlphabet}]{${length}}$`).test(id)
}
