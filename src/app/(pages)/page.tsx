/**
 *
 */

import { Suspense } from "react"
import { Button, Container, H1, P, Section, Wrapper } from "~/components/ui"
import { api } from "~/server"
import { ClientRPCTest } from "./_components"

export default async function HomePage() {
    const thought = await api.thoughts.find.call({ content: "Hello, world!" })

    return (
        <Container>
            <Section>
                <Wrapper className="gap-4 px-4">
                    <H1>Hello.</H1>
                    <P>{"We're building a data layer and orchestration engine for your thoughts. Join the waitlist for early access when we launch."}</P>
                </Wrapper>

                <Button redirectTo="/waitlist">join waitlist</Button>

                <div className="text-center">{`Server RPC test: ${JSON.stringify(thought)}`}</div>

                <ClientRPCTest />
            </Section>
        </Container>
    )
}
