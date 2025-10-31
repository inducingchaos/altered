/**
 *
 */

"use client"

import { usePathname } from "next/navigation"
import { Button } from "~/components/ui"

export function WaitlistButton() {
    const pathname = usePathname()
    const isWaitlistPage = pathname === "/waitlist"

    if (isWaitlistPage) return null

    return (
        <Button size="compact" redirectTo="/waitlist">
            join waitlist
        </Button>
    )
}
