/**
 *
 */

import { Logo, Wrapper, NavBar as _NavBar } from "~/components/ui"
import { AuthButton } from "./auth-button"
import { WaitlistButton } from "./waitlist-button"

export function NavBar() {
    return (
        <_NavBar>
            <Wrapper className="pl-5.5 pr-3.5 w-full justify-between">
                <Logo>altered</Logo>

                <Wrapper className="gap-3.5">
                    <WaitlistButton />

                    <AuthButton />
                </Wrapper>
            </Wrapper>
        </_NavBar>
    )
}
