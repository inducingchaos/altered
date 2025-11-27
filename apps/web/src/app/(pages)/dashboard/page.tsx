/**
 *
 */

import { Route } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Container, Section, Wrapper } from "~/components/ui/_legacy"
import { auth } from "~/lib/auth"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockThoughts } from "./constants"
import { ThoughtWithDatasets } from "./types"

async function getThoughts(): Promise<ThoughtWithDatasets[]> {
    //  TODO [P1]: Replace with actual data fetching.

    return mockThoughts
}

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) redirect(`/sign-in?callback-url=${encodeURIComponent("/dashboard")}` as Route)

    const thoughts = await getThoughts()

    return (
        <Container>
            <Section>
                <Wrapper className="gap-4 px-4 flex-col w-full max-w-6xl">
                    <h1 className="text-2xl font-semibold">Thoughts</h1>
                    <DataTable columns={columns} data={thoughts} />
                </Wrapper>
            </Section>
        </Container>
    )
}
