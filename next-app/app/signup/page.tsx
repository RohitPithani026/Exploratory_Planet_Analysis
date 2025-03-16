"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github, Globe, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/components/theme-provider"

export default function SignUp() {
    const router = useRouter()
    const { toast } = useToast()
    const { blurEffects } = useTheme()

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [error, setError] = useState("")
    //const { data: session } = useSession()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            // Register the user
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: name,
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Registration failed")
            }

            // After successful registration, sign in the user
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Registration successful, but could not sign in automatically")
                toast({
                    title: "Registration successful!",
                    description: "Please sign in with your new credentials.",
                })
                router.push("/signin")
            } else {
                toast({
                    title: "Registration successful!",
                    description: "Your account has been created and you're now signed in.",
                })
                router.push("/dashboard")
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred"
            setError(message)
            toast({
                title: "Registration failed",
                description: message,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // const handleOAuthSignUp = async (provider: string) => {
    //     setIsLoading(true)
    //     try {
    //         const result = await signIn(provider, {
    //             callbackUrl: "/dashboard",
    //             redirect: false, // Prevent immediate redirection
    //         })
    
    //         if (result?.error) {
    //             throw new Error("OAuth sign-in failed")
    //         }
    
    //         // Fetch the current session
    //         const session = await fetch("/api/auth/session").then((res) => res.json())
    
    //         console.log("Session Data:", session) // Debugging the session
    
    //         if (!session || !session.user) {
    //             throw new Error("Session not found")
    //         }
    
    //         // Send user data to the backend to store in the database
    //         const response = await fetch("/api/register", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 fullName: session?.user?.name,
    //                 email: session?.user?.email,
    //                 provider: provider.toUpperCase(),
    //             }),
    //         })            
    
    //         if (!response.ok) {
    //             const data = await response.json()
    //             throw new Error(data.error || "Failed to store user data")
    //         }
    
    //         toast({
    //             title: "Sign-up successful!",
    //             description: "Your account has been created successfully.",
    //         })
    
    //         router.push("/dashboard")
    //     } catch (error) {
    //         toast({
    //             title: "Authentication failed",
    //             description: error instanceof Error ? error.message : "An error occurred",
    //             variant: "destructive",
    //         })
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }
    
    const handleOAuthSignUp = async (provider: string) => {
        setIsLoading(true)
        try {
            await signIn(provider, {
                callbackUrl: "/dashboard",
            })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: "Authentication failed",
                description: "Could not sign up with the selected provider.",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#030014]">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-no-repeat opacity-10"></div>
                <div className="absolute inset-0 bg-[#030014]/80"></div>
                <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-indigo-900/20 blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[100px]"></div>
            </div>
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                <div className="container flex h-16 items-center justify-between p-8">
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
                    <div
                        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-8 shadow-2xl ${blurEffects ? "backdrop-blur-sm" : ""}`}
                    >
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900/30 to-transparent"></div>
                        <div className="space-y-2 text-center">
                            <h1 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
                                Create an account
                            </h1>
                            <p className="text-white/60">Enter your information to get started</p>
                        </div>
                        <div className="mt-8 space-y-6">
                            {error && (
                                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white/70">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white/70">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-white/70">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="terms"
                                        checked={agreeTerms}
                                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                                        required
                                        className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none text-white/70 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree to the{" "}
                                        <Link href="#" className="text-indigo-400 hover:text-indigo-300">
                                            terms of service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="#" className="text-indigo-400 hover:text-indigo-300">
                                            privacy policy
                                        </Link>
                                    </label>
                                </div>
                                <Button
                                    type="submit"
                                    className="relative w-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25"
                                    disabled={isLoading || !agreeTerms}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        <span className="relative z-10">Sign Up</span>
                                    )}
                                </Button>
                            </form>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-black/50 px-2 text-white/40 backdrop-blur-sm">Or continue with</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => handleOAuthSignUp("google")}
                                    disabled={isLoading}
                                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                >
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                        <path d="M1 1h22v22H1z" fill="none" />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleOAuthSignUp("github")}
                                    disabled={isLoading}
                                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                >
                                    <Github className="mr-2 h-4 w-4" />
                                    GitHub
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-sm text-white/40">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-indigo-400 hover:text-indigo-300">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

