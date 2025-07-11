import type { TRPCRouterRecord } from "@trpc/server"
import { z } from "zod"

import { count, desc, eq } from "@altered/db"
import { creatableThoughtSchema, thoughts } from "@altered/db/schema"

import { publicProcedure } from "../trpc"

export const thoughtsRouter = {
    all: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
        return await ctx.db.query.thoughts.findMany({
            where: eq(thoughts.userId, input.userId),
            orderBy: desc(thoughts.createdAt),
            limit: 25
        })
    }),

    count: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
        const result = await ctx.db.select({ count: count() }).from(thoughts).where(eq(thoughts.userId, input.userId))

        if (!result[0]?.count) return 0

        return result[0].count
    }),

    //   byId: publicProcedure
    //     .input(z.object({ id: z.string() }))
    //     .query(({ ctx, input }) => {
    //       // return ctx.db
    //       //   .select()
    //       //   .from(schema.post)
    //       //   .where(eq(schema.post.id, input.id));

    //       return ctx.db.query.Post.findFirst({
    //         where: eq(Post.id, input.id),
    //       });
    //     }),

    /**
     * @todo [P0] Make protected once auth is implemented.
     */
    create: publicProcedure.input(creatableThoughtSchema).mutation(({ ctx, input }) => {
        return ctx.db.insert(thoughts).values(input)
    }),

    /**
     * @todo [P0] Make protected once auth is implemented.
     */
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
        return ctx.db.delete(thoughts).where(eq(thoughts.id, input.id))
    })
} satisfies TRPCRouterRecord
