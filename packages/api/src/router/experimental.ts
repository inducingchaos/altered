/**
 *
 */

import type { TRPCRouterRecord } from "@trpc/server"
import { nanoid } from "nanoid"
import { z } from "zod"

import { protectedProcedure, publicProcedure } from "../trpc"

export const experimentalRouter = {
    nanoid: publicProcedure.input(z.object({ length: z.number().min(1).max(21) })).query(({ input }) => {
        return { value: nanoid(input.length) }
    }),

    privateNanoid: protectedProcedure.input(z.object({ length: z.number().min(1).max(21) })).query(({ input }) => {
        return { value: nanoid(input.length) }
    })
} satisfies TRPCRouterRecord
