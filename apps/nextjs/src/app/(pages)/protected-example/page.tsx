/**
 *
 */

import { headers } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Button, Container, P, Section, Wrapper } from "~/components/ui"
import { auth } from "~/lib/auth"
import { ClientRPCTest, ServerRPCTest } from "./_components"

export default async function ProtectedExamplePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) redirect(`/sign-in?callback-url=${encodeURIComponent("/protected-example")}`)

    return (
        <Container>
            <Section>
                <Wrapper className="gap-4 px-4 flex-col">
                    {session.user.image && <Image src={session.user.image} alt={session.user.name} width={64} height={64} className="border-2 border-foreground/12.5" />}

                    <P>{`Welcome, ${session.user.name.split(" ")[0]}! This is a protected page.`}</P>
                    <Button>{"go back"}</Button>

                    <Suspense fallback={<div>{"Loading..."}</div>}>
                        <ServerRPCTest />
                    </Suspense>

                    <ClientRPCTest />
                </Wrapper>
            </Section>
        </Container>
    )
}
