import type { TRPCRouterRecord } from "@trpc/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { z } from "zod"

import type { Thought } from "@altered/db/schema"
import { asc, count, desc, eq } from "@altered/db"
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
    }),

    /**
     * @todo [P0] Make protected once auth is implemented.
     * @todo [P3] Use `userId` from context once auth is implemented.
     */
    generate: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                query: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const allThoughts = await ctx.db.query.thoughts.findMany({
                where: eq(thoughts.userId, input.userId),
                orderBy: asc(thoughts.createdAt)
            })

            const system = createSystem(allThoughts)

            console.log(system)

            const result = await generateText({
                model: openai("gpt-4.1-mini"),
                system,
                prompt: input.query
            })

            return result.text as unknown as string
        })
} satisfies TRPCRouterRecord

const instructions = `You are an AI for a digital-brain app that helps users think and organize their thoughts. Assume the following chronologically-ordered thought list as your own.

Maintain a very reserved personality, almost like you're "starting from zero" until the user accumulates enough thoughts for you to confidently mirror their communication style.`

const createSystem = (allThoughts: Thought[]) => `# Instructions

${instructions}

# Thoughts

${allThoughts.map(thought => `- ${new Date(thought.createdAt).toLocaleDateString()} - ${thought.content}`).join("\n")}`
