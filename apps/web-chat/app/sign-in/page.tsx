/**
 *
 */

import { redirect } from "next/navigation"
import { signInUrl } from "@/lib/auth"

export default function SignInPage() {
    redirect(signInUrl)
}
