"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MenuPortal } from "@/components/MenuPortal"

interface MobileMenuProps {
    links: {
        href: string
        label: string
    }[]
}

export function MobileMenu({ links }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

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
                <MenuPortal>
                    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col">
                        <div className="flex justify-end p-4">
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

                        <div className="flex flex-col justify-center items-center text-center px-4 space-y-8">
                            {/* Navigation Links */}
                            <nav className="flex flex-col gap-4 w-full max-w-xs">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium text-white/70 transition-colors hover:text-white py-2 border-b border-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Sign In & Sign Up */}
                            <div className="flex flex-col gap-4 w-full max-w-xs">
                                <Link href="/signin">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full text-white border-white/20 hover:bg-white/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
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
                </MenuPortal>
            )}
        </div>
    )
}
