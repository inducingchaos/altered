/**
 *
 */

import { NavBar as _NavBar, Logo, Wrapper } from "~/components/ui/_legacy"
import { AuthButton } from "./auth-button"
import { WaitlistButton } from "./waitlist-button"

export function NavBar() {
    return (
        <_NavBar>
            <Wrapper className="w-full justify-between pr-3.5 pl-5.5">
                <Logo>altered</Logo>

                <Wrapper className="gap-3.5">
                    <WaitlistButton />

                    <AuthButton />
                </Wrapper>
            </Wrapper>
        </_NavBar>
    )
}
