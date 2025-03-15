"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
    links: {
        href: string
        label: string
    }[]
}

export function MobileMenu({ links }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }

        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
                    <div className="container py-4 flex flex-col h-full">
                        <div className="flex justify-end mb-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/70 hover:bg-white/10 hover:text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close menu</span>
                            </Button>
                        </div>

                        <nav className="flex flex-col gap-2 flex-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg font-medium text-white/70 transition-colors hover:text-white py-3 border-b border-white/10"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex flex-col gap-4 pt-4 mt-auto">
                            <Link href="/signin" className="w-full">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full text-white border-white/20 hover:bg-white/10"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/signup" className="w-full">
                                <Button
                                    size="lg"
                                    className="w-full relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="relative z-10">Sign Up</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

