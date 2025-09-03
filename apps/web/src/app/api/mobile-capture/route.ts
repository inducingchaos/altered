/**
 * @todo [P2] Replace with dynamic solution.
 */

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { createCaller } from "@altered/api"
import { db } from "@altered/db/client"

const trpc = createCaller({
    session: null,
    db: db,
    token: null
})

export async function POST(req: NextRequest) {
    const data = (await req.json()) as { userId: string; content: string }

    await trpc.thoughts.create(data)

    return NextResponse.json({ message: "Thought successfully created." })
}
