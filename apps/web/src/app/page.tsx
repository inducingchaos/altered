import { headers as getHeaders } from "next/headers"

import { auth } from "@altered/auth"

import { HydrateClient } from "~/trpc/server"
import { AuthButton } from "./_components/auth-button"

export default async function Landing({ searchParams }: { searchParams: Promise<{ "callback-url"?: string }> }) {
    // prefetch(trpc.data.all.queryOptions())

    const headers = await getHeaders()
    const session = await auth.api.getSession({ headers })

    const callbackUrl = (await searchParams)["callback-url"]

    return (
        <HydrateClient>
            <main className="container flex min-h-dvh w-full flex-col items-center justify-center">
                <div className="flex w-full flex-col items-center justify-center gap-4 px-8">
                    <h1 className="font-mono text-xl font-bold">{"ALTERED"}</h1>

                    <AuthButton session={session} callback={callbackUrl} />
                </div>
            </main>
        </HydrateClient>
    )
}
