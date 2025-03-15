"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function AuthError() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const error = searchParams.get("error")

    useEffect(() => {
        if (error) {
            const errorMessages: Record<string, string> = {
                OAuthSignin: "Error in the OAuth sign-in process.",
                OAuthCallback: "Error in the OAuth callback.",
                OAuthCreateAccount: "Could not create an account with the OAuth provider.",
                EmailCreateAccount: "Could not create an account with the provided email.",
                Callback: "Error during authentication callback.",
                AccessDenied: "You do not have permission to sign in.",
                default: "An error occurred during authentication.",
            }

            const errorMessage = errorMessages[error] || errorMessages.default

            toast({
                title: "Authentication Error",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }, [error, toast])

    return (
        <div className="flex min-h-screen flex-col bg-[#030014]">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-no-repeat opacity-10"></div>
                <div className="absolute inset-0 bg-[#030014]/80"></div>
                <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-indigo-900/20 blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[100px]"></div>
            </div>
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative">
                            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur"></div>
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black">
                                <Globe className="h-5 w-5 text-indigo-400" />
                            </div>
                        </div>
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-xl font-bold text-transparent">
                            ExoHabit
                        </span>
                    </Link>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="relative mx-auto w-full max-w-md space-y-6">
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 p-1"></div>
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-8 shadow-2xl backdrop-blur-sm">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900/30 to-transparent"></div>
                        <div className="flex flex-col items-center space-y-6 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                                <AlertTriangle className="h-10 w-10 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-white">Authentication Error</h1>
                                <p className="text-white/60">
                                    {error
                                        ? `An error occurred during authentication: ${error}`
                                        : "An unexpected error occurred during authentication."}
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                <Button
                                    variant="outline"
                                    className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    onClick={() => router.push("/signin")}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Return to Sign In
                                </Button>
                                <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">
                                    Go to Home Page
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

