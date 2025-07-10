import { cn } from "@altered/ui"

export function TypographyP(props: React.ComponentProps<"p">) {
    return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", props.className)} {...props} />
}
