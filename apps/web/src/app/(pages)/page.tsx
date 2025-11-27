/**
 *
 */

import { Button, Container, H1, P, Section, Wrapper } from "~/components/ui/_legacy"

export default function HomePage() {
    return (
        <Container>
            <Section>
                <Wrapper className="gap-4 px-4 flex-col">
                    <H1>{"Hello."}</H1>
                    <P>{"We're building a data layer and orchestration engine for your thoughts. Join the waitlist for early access when we launch."}</P>
                </Wrapper>

                <Wrapper className="gap-4 px-4">
                    <Button redirectTo="/dashboard">{"go to app"}</Button>
                    <Button redirectTo="/waitlist">{"join waitlist"}</Button>
                    <Button redirectTo="/protected-example">{"protected example"}</Button>
                </Wrapper>
            </Section>
        </Container>
    )
}

export { metadata } from "./_config/metadata/page"
