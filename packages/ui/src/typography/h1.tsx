import { cn } from "@altered-42/ui"

export function TypographyH1(props: React.ComponentProps<"h1">) {
    return <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", props.className)} {...props} />
}
