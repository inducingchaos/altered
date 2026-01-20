/**
 *
 */

import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"

/**
 * @todo [P4] Could revise classes on divs; good enough for now.
 */
export async function ErrorPageContent({
    params
}: {
    params: Promise<{ title: string; message: string }>
}) {
    const { title, message } = await params

    return (
        <div className="flex h-dvh items-center justify-center">
            <div className="flex max-w-md flex-col items-center gap-6 px-4 text-center">
                <div className="flex flex-col gap-2">
                    <h1 className="font-semibold text-2xl">{title}</h1>
                    <p className="text-muted-foreground">{message}</p>
                </div>
                <Button asChild>
                    <Link href="/">Return to Home</Link>
                </Button>
            </div>
        </div>
    )
}

/**
 * @remarks Accepts a title and message as query parameters.
 *
 * @todo [P3] Figure out why this pattern is necessary for Cache Components.
 */
export default async function ErrorPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = searchParams.then(
        ({ title: titleParam, message: messageParam }) => {
            const { resolvedTitle, resolvedMessage } = {
                resolvedTitle: Array.isArray(titleParam)
                    ? titleParam[0]
                    : titleParam,
                resolvedMessage: Array.isArray(messageParam)
                    ? messageParam[0]
                    : messageParam
            }

            const title = resolvedTitle ?? "Error"
            const message =
                resolvedMessage ??
                "An unexpected error occurred. Please try again later."

            return {
                title,
                message
            }
        }
    )

    return (
        <Suspense fallback={<ErrorPageContent params={params} />}>
            <ErrorPageContent params={params} />
        </Suspense>
    )
}
