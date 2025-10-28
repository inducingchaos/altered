/**
 *
 */

import { Suspense } from "react"
import { Button, Container, H1, P, Section, Wrapper } from "~/components/ui"
import { ClientRPCTest, ServerRPCTest } from "./_components"

export default function HomePage() {
    return (
        <Container>
            <Section>
                <Wrapper className="gap-4 px-4">
                    <H1>{"Hello."}</H1>
                    <P>{"We're building a data layer and orchestration engine for your thoughts. Join the waitlist for early access when we launch."}</P>
                </Wrapper>

                <Button redirectTo="/waitlist">{"join waitlist"}</Button>

                <Suspense fallback={<div>{"Loading..."}</div>}>
                    <ServerRPCTest />
                </Suspense>

                <ClientRPCTest />
            </Section>
        </Container>
    )
}
