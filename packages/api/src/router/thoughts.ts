import type { TRPCRouterRecord } from "@trpc/server"
import { z } from "zod"

import { desc, eq } from "@altered/db"
import { creatableThoughtSchema, thoughts } from "@altered/db/schema"

import { publicProcedure } from "../trpc"

export const thoughtsRouter = {
    all: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.thoughts.findMany({
            orderBy: desc(thoughts.createdAt),
            limit: 25
        })
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
