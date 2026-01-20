/**
 * @todo [P3] Remove once MVP is stable.
 */

import { auth } from "@altered-internal/auth"
import type { Route } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Button, Container, P, Section, Wrapper } from "~/components/ui/_legacy"
import { ClientRPCTest, ServerRPCTest } from "./_components"

export default async function ProtectedExamplePage() {
    const { data: session } = await auth.api.getSession({
        headers: await headers()
    })

    if (!session)
        redirect(
            `/sign-in?callback-url=${encodeURIComponent("/protected-example")}` as Route
        )

    return (
        <Container>
            <Section>
                <Wrapper className="flex-col gap-4 px-4">
                    {session.user.image && (
                        <Image
                            alt={session.user.name}
                            className="border-2 border-foreground/12.5"
                            height={64}
                            src={session.user.image}
                            width={64}
                        />
                    )}

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
