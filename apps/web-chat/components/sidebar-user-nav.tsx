"use client"

import { ChevronUp } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth/client"
import type { ChatUser } from "@/lib/auth/shared"

export function SidebarUserNav({ user }: { user: ChatUser | null }) {
    const { setTheme, resolvedTheme } = useTheme()

    const { isLoading, signOut, signIn } = useAuth()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            className="h-10 bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            data-testid="user-nav-button"
                        >
                            <Image
                                alt={user?.email ?? "Guest User"}
                                className="rounded-full"
                                height={24}
                                src={
                                    user?.email
                                        ? `https://avatar.vercel.sh/${user.email}`
                                        : "https://avatar.vercel.sh/guest"
                                }
                                width={24}
                            />
                            <span className="truncate" data-testid="user-email">
                                {user?.email ?? "Guest"}
                            </span>
                            <ChevronUp className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-popper-anchor-width)"
                        data-testid="user-nav-menu"
                        side="top"
                    >
                        <DropdownMenuItem
                            className="cursor-pointer"
                            data-testid="user-nav-item-theme"
                            onSelect={() =>
                                setTheme(
                                    resolvedTheme === "dark" ? "light" : "dark"
                                )
                            }
                        >
                            {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            asChild
                            data-testid="user-nav-item-auth"
                        >
                            {user ? (
                                <button
                                    className="w-full cursor-pointer"
                                    disabled={isLoading}
                                    onClick={signOut}
                                    type="button"
                                >
                                    {isLoading ? "Signing out..." : "Sign out"}
                                </button>
                            ) : (
                                <button
                                    className="w-full cursor-pointer"
                                    disabled={isLoading}
                                    onClick={() => signIn()}
                                    type="button"
                                >
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </button>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
