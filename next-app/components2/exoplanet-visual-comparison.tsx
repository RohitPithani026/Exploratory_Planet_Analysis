"use client"

import { useRef, useEffect } from "react"
import type { Exoplanet } from "@/lib/types"

interface ExoplanetVisualComparisonProps {
  exoplanets: Exoplanet[]
}

export default function ExoplanetVisualComparison({ exoplanets }: ExoplanetVisualComparisonProps) {
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

    // Sort planets by radius (largest first)
    const sortedPlanets = [...exoplanets].sort((a, b) => b.radius - a.radius)

    // Calculate scale factor - Earth (radius 1) will be 30px
    const baseSize = 30
    const maxRadius = Math.max(...sortedPlanets.map((p) => p.radius))
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
    sortedPlanets.forEach((planet, index) => {
      const radius = planet.radius * scaleFactor
      const color = getPlanetColor(planet.type)

      // Calculate position
      const x = currentX + radius

      // Draw the planet
      drawPlanet(ctx, x, centerY, radius, planet.name, planet.radius, color)

      // Update position for next planet
      currentX = x + radius + spacing
    })
  }, [exoplanets])

  return (
    <div className="w-full h-[200px] mt-4">
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
  ctx.shadowColor = color.replace(")", ", 0.6)")

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
  ctx.fillText(`${realRadius}×`, x, y + radius + 30)
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

// Helper function for consistent planet colors
function getPlanetColor(type: string): string {
  switch (type.toLowerCase()) {
    case "super-earth":
      return "rgba(16, 185, 129, 0.8)" // emerald
    case "rocky":
      return "rgba(245, 158, 11, 0.8)" // amber
    case "hot jupiter":
      return "rgba(249, 115, 22, 0.8)" // orange
    case "mini-neptune":
      return "rgba(59, 130, 246, 0.8)" // blue
    default:
      return "rgba(139, 92, 246, 0.8)" // purple
  }
}

