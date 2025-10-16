/**
 *
 */

"use client"

import { usePathname } from "next/navigation"
import { Button, Logo, NavBar as _NavBar } from "~/components/ui"

export function NavBar() {
    const pathname = usePathname()
    const isWaitlistPage = pathname === "/waitlist"

    return (
        <_NavBar>
            <Logo className="px-6">altered</Logo>
            {!isWaitlistPage && <Button className="px-3">join waitlist</Button>}
        </_NavBar>
    )
}
