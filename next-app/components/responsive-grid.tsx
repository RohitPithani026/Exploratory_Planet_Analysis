import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps {
    children: React.ReactNode
    className?: string
    columns?: {
        xs?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
    }
    gap?: string
}

export function ResponsiveGrid({
    children,
    className,
    columns = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
    gap = "gap-4 md:gap-6",
}: ResponsiveGridProps) {
    // Generate grid template columns classes based on the columns prop
    const gridCols = [
        columns.xs && `grid-cols-${columns.xs}`,
        columns.sm && `sm:grid-cols-${columns.sm}`,
        columns.md && `md:grid-cols-${columns.md}`,
        columns.lg && `lg:grid-cols-${columns.lg}`,
        columns.xl && `xl:grid-cols-${columns.xl}`,
    ]
        .filter(Boolean)
        .join(" ")

    return <div className={cn("grid w-full", gridCols, gap, className)}>{children}</div>
}

