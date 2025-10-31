/**
 *
 */

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Container, P, Section } from "~/components/ui"
import { auth } from "~/lib/auth"
import { SignInOnMount } from "./_components"

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { "callback-url": _callbackUrl } = await searchParams
    const callbackUrl = (typeof _callbackUrl === "string" ? _callbackUrl : undefined) ?? "/"

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) redirect(callbackUrl)

    return (
        <Container>
            <Section>
                <SignInOnMount callbackUrl={callbackUrl} />
                <P>{"Signing in..."}</P>
            </Section>
        </Container>
    )
}
