/**
 * @todo [P2] Build a proper sign in page.
 * @todo [P3] Add typed routes?
 */

import { Route } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Container, P, Section } from "~/components/ui/_legacy"
import { auth } from "@altered-internal/auth"
import { SignInOnMount } from "./_components"
import { resolveCallbackUrl, SignInSearchParams } from "./_utils/resolve-callback"

export default async function SignInPage({ searchParams }: { searchParams: Promise<SignInSearchParams> }) {
    const params = await searchParams
    const callbackUrl = resolveCallbackUrl(params)

    const sessionResult = await auth.api.getSession({
        headers: await headers()
    })

    const session = "data" in sessionResult ? sessionResult.data : null

    if (session) redirect(callbackUrl as Route)

    return (
        <Container>
            <Section>
                <SignInOnMount callbackUrl={callbackUrl} />
                <P>{"Signing in..."}</P>
            </Section>
        </Container>
    )
}
