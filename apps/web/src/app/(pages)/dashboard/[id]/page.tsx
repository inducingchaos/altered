/**
 *
 */

import { Route } from "next"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Container, Section, Wrapper } from "~/components/ui/_legacy"
import { auth } from "~/lib/auth"
import { mockThoughts } from "../_constants"
import { ThoughtWithDatasets } from "../_types"

async function getThought(id: string): Promise<ThoughtWithDatasets | null> {
    //  TODO [P1]: Replace with actual data fetching.

    return mockThoughts.find(thought => thought.id === id) ?? null
}

type ThoughtDetailPageProps = {
    params: Promise<{ id: string }>
}

export default async function ThoughtDetailPage({ params }: ThoughtDetailPageProps) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) redirect(`/sign-in?callback-url=${encodeURIComponent("/dashboard")}` as Route)

    const { id } = await params
    const thought = await getThought(id)

    if (!thought) notFound()

    return (
        <Container>
            <Section>
                <Wrapper className="gap-6 px-4 flex-col w-full max-w-3xl">
                    <div className="space-y-2">
                        {thought.alias && <h1 className="text-2xl font-semibold">{thought.alias}</h1>}
                        <div className="flex gap-2">
                            {thought.datasets.map(dataset => (
                                <span key={dataset} className="px-2 py-0.5 text-xs bg-muted rounded-md">
                                    {dataset}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-lg leading-relaxed">{thought.content}</p>
                </Wrapper>
            </Section>
        </Container>
    )
}
