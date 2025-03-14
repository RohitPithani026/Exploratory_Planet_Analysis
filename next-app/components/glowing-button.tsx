"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface GlowingButtonProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
}

export function GlowingButton({ children, onClick, className }: GlowingButtonProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div className="relative">
            <motion.div
                animate={{
                    opacity: isHovered ? 1 : 0.5,
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur-md"
            />
            <Button
                className={`relative z-10 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 ${className}`}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.span
                    animate={{
                        y: isHovered ? -20 : 0,
                        opacity: isHovered ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {children}
                </motion.span>
                <motion.span
                    animate={{
                        y: isHovered ? 0 : 20,
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                >
                    {children}
                </motion.span>
            </Button>
        </div>
    )
}

