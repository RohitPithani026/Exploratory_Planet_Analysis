"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { useSession, signOut } from "next-auth/react"
import { Globe, LogOut, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const dashboardLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/exoplanets", label: "Exoplanets" },
    { href: "/dashboard/profile", label: "Profile" },
]

export function DashboardHeader() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [mounted, setMounted] = useState(false)
    const [fullName, setFullName] = useState<string | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.fullName) setFullName(data.fullName) })
            .catch(() => {})
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [mobileOpen])

    useEffect(() => {
        const close = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
        window.addEventListener("resize", close)
        return () => window.removeEventListener("resize", close)
    }, [])

    const isActive = (href: string) => {
        if (!mounted) return false
        if (href === "/dashboard") return pathname === "/dashboard"
        if (href === "/dashboard/exoplanets") return pathname.startsWith("/dashboard/exoplanet")
        return pathname.startsWith(href)
    }

    const displayName = fullName || session?.user?.name || session?.user?.email?.split("@")[0] || "User"

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                <div className="flex h-16 md:h-20 w-full items-center justify-between px-4 md:px-8">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
                        <div className="relative">
                            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur" />
                            <div className="relative flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-black">
                                <Globe className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />
                            </div>
                        </div>
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-xl md:text-2xl font-bold text-transparent">
                            ExoHabit
                        </span>
                    </Link>

                    {/* Desktop nav — centered absolutely so logo/avatar don't compete */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-10">
                        {dashboardLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`relative text-base font-semibold transition-colors hover:text-indigo-300 ${
                                    isActive(href) ? "text-white" : "text-white/60"
                                }`}
                            >
                                {label}
                                {isActive(href) && (
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: hamburger (mobile) + avatar */}
                    <div className="flex items-center gap-2">
                        {/* Hamburger — mobile only */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-white/70 hover:bg-white/10 hover:text-white h-9 w-9"
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>

                        {/* Avatar dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full p-0 h-9 w-9 hover:bg-white/10">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={session?.user?.image || ""} alt="User" />
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                                            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 border-white/10 bg-black/90 text-white backdrop-blur-xl">
                                <div className="px-2 py-1.5">
                                    <p className="text-sm font-medium">{displayName}</p>
                                    <p className="text-xs text-white/50 truncate">{session?.user?.email}</p>
                                </div>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Mobile nav drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Slide-down panel */}
                        <motion.nav
                            key="mobile-nav"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="fixed top-16 inset-x-0 z-50 md:hidden border-b border-white/10 bg-black/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-1"
                        >
                            {dashboardLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
                                        isActive(href)
                                            ? "bg-indigo-500/15 text-white"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    {label}
                                    {isActive(href) && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                    )}
                                </Link>
                            ))}
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
