"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    useEffect(() => {
        // Handle OAuth errors
        if (error) {
            const errorMessages: Record<string, { title: string; description: string }> = {
                OAuthSignin: {
                    title: "OAuth Error",
                    description: "Error in the OAuth sign-in process. Please try again.",
                },
                OAuthCallback: {
                    title: "OAuth Callback Error",
                    description: "Error in the OAuth callback. Please try again.",
                },
                OAuthCreateAccount: {
                    title: "Account Creation Failed",
                    description: "Could not create an account with the OAuth provider.",
                },
                EmailCreateAccount: {
                    title: "Account Creation Failed",
                    description: "Could not create an account with the provided email.",
                },
                Callback: {
                    title: "Callback Error",
                    description: "Error during authentication callback.",
                },
                AccessDenied: {
                    title: "Access Denied",
                    description: "You do not have permission to sign in.",
                },
                default: {
                    title: "Authentication Error",
                    description: "An error occurred during authentication. Please try again.",
                },
            }

            const errorInfo = errorMessages[error] || errorMessages.default

            toast({
                title: errorInfo.title,
                description: errorInfo.description,
                variant: "destructive",
            })
        }
    }, [error, toast])

    return <SessionProvider>{children}</SessionProvider>
}

