/**
 *
 */

import type { TRPCRouterRecord } from "@trpc/server"
import { z } from "zod"

import { eq } from "@altered-42/db"
import { users } from "@altered-42/db/schema"

import { publicProcedure } from "../trpc"

export const usersRouter = {
    get: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return ctx.db.query.users.findFirst({ where: eq(users.id, input.id) })
    })
} satisfies TRPCRouterRecord
