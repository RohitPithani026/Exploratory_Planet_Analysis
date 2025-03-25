"use client"

import { useRef, useEffect } from "react"
import type { Exoplanet } from "@/lib/types"

interface ExoplanetSizeComparisonProps {
    exoplanets: Exoplanet[]
}

export default function ExoplanetSizeComparison({ exoplanets }: ExoplanetSizeComparisonProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height)

        // Draw background grid
        drawGrid(ctx, rect.width, rect.height)

        // Add a subtle glow effect
        ctx.shadowBlur = 15
        ctx.shadowColor = "rgba(59, 130, 246, 0.3)"

        // Filter out exoplanets with missing radius data
        const validExoplanets = exoplanets.filter((planet) => planet.pl_rade !== null && planet.pl_rade !== undefined)

        // Sort planets by radius (largest first)
        const sortedPlanets = [...validExoplanets].sort((a, b) => (b.pl_rade || 0) - (a.pl_rade || 0))

        // Calculate scale factor - Earth (radius 1) will be 30px
        const baseSize = 30
        const maxRadius = Math.max(...sortedPlanets.map((p) => p.pl_rade || 0))
        const scaleFactor = Math.min(baseSize, 200 / maxRadius)

        // Draw planets
        const centerY = rect.height / 2
        let currentX = 80 // Starting position
        const spacing = 20 // Space between planets

        // Draw Earth for reference
        drawPlanet(ctx, 50, centerY, baseSize, "Earth", 1, "#3b82f6")

        // Draw vertical line separator
        ctx.beginPath()
        ctx.moveTo(70, 40)
        ctx.lineTo(70, rect.height - 40)
        ctx.strokeStyle = "rgba(100, 116, 139, 0.2)"
        ctx.stroke()

        // Draw exoplanets
        sortedPlanets.forEach((planet) => {
            const radius = (planet.pl_rade || 0) * scaleFactor
            const habitabilityScore = planet.habitability_score || 0
            const color = getHabitabilityColor(habitabilityScore)

            // Calculate position
            const x = currentX + radius

            // Draw the planet
            drawPlanet(ctx, x, centerY, radius, planet.pl_name, planet.pl_rade || 0, color)

            // Update position for next planet
            currentX = x + radius + spacing
        })
    }, [exoplanets])

    return (
        <div className="w-full h-[400px] mt-4">
            <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
        </div>
    )
}

function drawPlanet(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    name: string,
    realRadius: number,
    color: string,
) {
    // Add glow effect
    ctx.shadowBlur = 15
    ctx.shadowColor = color.replace("hsl", "hsla").replace(")", ", 0.6)")

    // Draw planet
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    // Reset shadow for outline
    ctx.shadowBlur = 0

    // Draw outline
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw name
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "hsl(var(--foreground))"
    ctx.textAlign = "center"
    ctx.fillText(name, x, y + radius + 16)

    // Draw radius value
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "hsl(var(--muted-foreground))"
    ctx.fillText(`${realRadius.toFixed(2)}×`, x, y + radius + 30)
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const gridSize = 20
    ctx.beginPath()

    // Draw horizontal lines
    for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
    }

    // Draw vertical lines
    for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
    }

    ctx.strokeStyle = "rgba(100, 116, 139, 0.1)"
    ctx.lineWidth = 1
    ctx.stroke()
}

// Helper function for habitability color gradient
function getHabitabilityColor(score: number): string {
    if (score >= 70) return "hsl(152, 75%, 40%)" // emerald
    if (score >= 50) return "hsl(142, 71%, 45%)" // green
    if (score >= 30) return "hsl(48, 96%, 53%)" // yellow
    if (score >= 10) return "hsl(27, 96%, 61%)" // orange
    return "hsl(0, 84%, 60%)" // red
}

