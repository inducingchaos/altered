/**
 * Pixel art icons from pixelarticons.com
 */

import { ComponentProps } from "react"
import { cn } from "~/utils/ui"

type IconProps = ComponentProps<"svg">

/**
 * @todo [P2]: Replace with source icons.
 */
export function IconSort({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M8 20H6V8H4V6h2V4h2v2h2v2H8v12zm2-12v2h2V8h-2zM4 8v2H2V8h2zm14-4h-2v12h-2v-2h-2v2h2v2h2v2h2v-2h2v-2h2v-2h-2v2h-2V4z" fill="currentColor" />
        </svg>
    )
}

export function IconArrowUp({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M11 20h2V8h2V6h-2V4h-2v2H9v2h2v12zM7 10V8h2v2H7zm0 0v2H5v-2h2zm10 0V8h-2v2h2zm0 0v2h2v-2h-2z" fill="currentColor" />
        </svg>
    )
}

export function IconArrowDown({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M11 4h2v12h2v2h-2v2h-2v-2H9v-2h2V4zM7 14v2h2v-2H7zm0 0v-2H5v2h2zm10 0v2h-2v-2h2zm0 0v-2h2v2h-2z" fill="currentColor" />
        </svg>
    )
}

export function IconMoreHorizontal({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M1 9h6v6H1V9zm2 2v2h2v-2H3zm6-2h6v6H9V9zm2 2v2h2v-2h-2zm6-2h6v6h-6V9zm2 2v2h2v-2h-2z" fill="currentColor" />
        </svg>
    )
}

/**
 * @todo [P2]: Replace with source icons.
 */
export function IconExternalLink({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z" fill="currentColor" />
        </svg>
    )
}

export function IconEdit({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M18 2h-2v2h-2v2h-2v2h-2v2H8v2H6v2H4v2H2v6h6v-2h2v-2h2v-2h2v-2h2v-2h2v-2h2V8h2V6h-2V4h-2V2zm0 8h-2v2h-2v2h-2v2h-2v2H8v-2H6v-2h2v-2h2v-2h2V8h2V6h2v2h2v2zM6 16H4v4h4v-2H6v-2z" fill="currentColor" />
        </svg>
    )
}

/**
 * @todo [P2]: Replace with source icons.
 */
export function IconTrash({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M16 2v4h6v2h-2v14H4V8H2V6h6V2h8zm-2 2h-4v2h4V4zm0 4H6v12h12V8h-4zm-5 2h2v8H9v-8zm6 0h-2v8h2v-8z" fill="currentColor" />
        </svg>
    )
}

export function IconSliders({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M17 4h2v10h-2V4zm0 12h-2v2h2v2h2v-2h2v-2h-4zm-4-6h-2v10h2V10zm-8 2H3v2h2v6h2v-6h2v-2H5zm8-8h-2v2H9v2h6V6h-2V4zM5 4h2v6H5V4z" fill="currentColor" />
        </svg>
    )
}

/**
 * @todo [P2]: Replace with source icons.
 */
export function IconChevronLeft({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M16 5v2h-2V5h2zm-4 4V7h2v2h-2zm-2 2V9h2v2h-2zm0 2H8v-2h2v2zm2 2v-2h-2v2h2zm0 0h2v2h-2v-2zm4 4v-2h-2v2h2z" fill="currentColor" />
        </svg>
    )
}

/**
 * @todo [P2]: Replace with source icons.
 */
export function IconChevronRight({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M8 5v2h2V5H8zm4 4V7h-2v2h2zm2 2V9h-2v2h2zm0 2h2v-2h-2v2zm-2 2v-2h2v2h-2zm0 0h-2v2h2v-2zm-4 4v-2h2v2H8z" fill="currentColor" />
        </svg>
    )
}

export function IconInfo({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M3 3h2v18H3V3zm16 0H5v2h14v14H5v2h16V3h-2zm-8 6h2V7h-2v2zm2 8h-2v-6h2v6z" fill="currentColor" />
        </svg>
    )
}

export function IconSearch({ className, ...props }: IconProps) {
    return (
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={cn("size-4", className)} {...props}>
            <path d="M6 2h8v2H6V2zM4 6V4h2v2H4zm0 8H2V6h2v8zm2 2H4v-2h2v2zm8 0v2H6v-2h8zm2-2h-2v2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm0-8h2v8h-2V6zm0 0V4h-2v2h2z" fill="currentColor" />
        </svg>
    )
}
