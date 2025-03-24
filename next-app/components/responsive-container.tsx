import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
    children: React.ReactNode
    className?: string
    fullWidth?: boolean
}

export function ResponsiveContainer({ children, className, fullWidth = false }: ResponsiveContainerProps) {
    return (
        <div className={cn("w-full px-4 sm:px-6 md:px-8", fullWidth ? "max-w-full" : "max-w-7xl mx-auto", className)}>
            {children}
        </div>
    )
}

