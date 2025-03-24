"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, Search, User, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileNavProps {
    currentPath?: string
}

export function MobileNav({ currentPath = "" }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false)
    const isMobile = useIsMobile()

    // Only render on mobile
    if (!isMobile) return null

    const navItems = [
        { icon: Home, label: "Home", href: "/dashboard" },
        { icon: Search, label: "Explore", href: "/dashboard/exoplanets" },
        { icon: User, label: "Profile", href: "/dashboard/profile" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        { icon: HelpCircle, label: "Help", href: "/dashboard/help" },
    ]

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-md text-white hover:bg-black/40"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
                    >
                        <div className="flex flex-col h-full pt-16 pb-8 px-6">
                            <nav className="flex-1">
                                <ul className="space-y-4">
                                    {navItems.map((item) => {
                                        const isActive = currentPath === item.href
                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                                                            ? "bg-indigo-600/20 text-indigo-400"
                                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="font-medium">{item.label}</span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>

                            <div className="mt-auto pt-4 border-t border-white/10">
                                <p className="text-white/50 text-sm text-center">Exoplanet Explorer v1.0</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

