/**
 *
 */

import { Route } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Container, Section, Wrapper } from "~/components/ui/_legacy"
import { auth } from "~/lib/auth"
import { ThoughtsTable } from "./_components"
import { mockThoughts } from "./_constants"

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) redirect(`/sign-in?callback-url=${encodeURIComponent("/dashboard")}` as Route)

    /**
     * @todo [P1]: Replace with actual data fetching.
     */
    const thoughts = mockThoughts

    return (
        <Container>
            <Section>
                <Wrapper className="gap-4 px-4 items-start flex-col w-full max-w-6xl">
                    <h1 className="text-3xl font-bold font-px-grotesk-mono tracking-tighter">Welcome, Riley</h1>
                    <ThoughtsTable data={thoughts} />
                </Wrapper>
            </Section>
        </Container>
    )
}
