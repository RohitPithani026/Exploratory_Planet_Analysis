"use client"

import { useEffect, useRef } from "react"

interface OrbitVisualizationProps {
    planetRadius: number
    orbitalPeriod: number
    starTemperature: number
    planetName: string
}

export function OrbitVisualization({
    planetRadius,
    orbitalPeriod,
    starTemperature,
    planetName,
}: OrbitVisualizationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Determine star color based on temperature
    const getStarColor = (temp: number) => {
        if (temp > 30000) return "#a5b4fc" // Blue
        if (temp > 10000) return "#c7d2fe" // Blue-white
        if (temp > 7500) return "#f9fafb" // White
        if (temp > 6000) return "#fef9c3" // Yellow-white
        if (temp > 5200) return "#fef08a" // Yellow (Sun-like)
        if (temp > 3700) return "#fdba74" // Orange
        return "#f87171" // Red
    }

    // Determine planet size based on radius (Earth = 1)
    const getPlanetSize = (radius: number) => {
        if (radius < 0.5) return 4 // Sub-Earth
        if (radius < 1.6) return 6 // Earth-like
        if (radius < 4) return 8 // Super-Earth
        if (radius < 10) return 12 // Neptune-like
        return 16 // Gas Giant
    }

    // Determine planet color based on radius
    const getPlanetColor = (radius: number) => {
        if (radius < 0.5) return "#fbbf24" // Sub-Earth
        if (radius < 1.6) return "#3b82f6" // Earth-like
        if (radius < 4) return "#2563eb" // Super-Earth
        if (radius < 10) return "#4f46e5" // Neptune-like
        return "#7e22ce" // Gas Giant
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        // Calculate center
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Calculate orbit radius (scaled to fit canvas)
        const orbitRadius = Math.min(centerX, centerY) * 0.7

        // Star properties
        const starRadius = Math.min(centerX, centerY) * 0.2
        const starColor = getStarColor(starTemperature)

        // Planet properties
        const planetSize = getPlanetSize(planetRadius)
        const planetColor = getPlanetColor(planetRadius)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw orbit
        ctx.beginPath()
        ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw habitable zone if applicable
        if (starTemperature > 2000 && starTemperature < 7000) {
            // Simple approximation of habitable zone
            const innerRadius = orbitRadius * 0.8
            const outerRadius = orbitRadius * 1.2

            ctx.beginPath()
            ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
            ctx.strokeStyle = "rgba(34, 197, 94, 0.2)"
            ctx.lineWidth = outerRadius - innerRadius
            ctx.stroke()
        }

        // Draw star
        const starGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, starRadius)
        starGradient.addColorStop(0, starColor)
        starGradient.addColorStop(1, "rgba(255, 255, 255, 0.1)")

        ctx.beginPath()
        ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2)
        ctx.fillStyle = starGradient
        ctx.fill()

        // Add glow effect to star
        ctx.shadowColor = starColor
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.arc(centerX, centerY, starRadius - 5, 0, Math.PI * 2)
        ctx.fillStyle = starColor
        ctx.fill()
        ctx.shadowBlur = 0

        // Draw star name
        ctx.font = "14px Inter, system-ui, sans-serif"
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.textAlign = "center"
        ctx.fillText(`Host Star`, centerX, centerY + starRadius + 20)

        // Calculate planet position
        const angle = (Date.now() / 1000) % (Math.PI * 2)
        const planetX = centerX + Math.cos(angle) * orbitRadius
        const planetY = centerY + Math.sin(angle) * orbitRadius

        // Draw planet
        ctx.beginPath()
        ctx.arc(planetX, planetY, planetSize, 0, Math.PI * 2)
        ctx.fillStyle = planetColor
        ctx.fill()

        // Add highlight to planet
        ctx.beginPath()
        ctx.arc(planetX - planetSize / 3, planetY - planetSize / 3, planetSize / 3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fill()

        // Draw planet name
        ctx.font = "12px Inter, system-ui, sans-serif"
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.textAlign = "center"
        ctx.fillText(planetName, planetX, planetY + planetSize + 15)

        // Request animation frame to update planet position
        requestAnimationFrame(() => {
            if (canvas) {
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    // Only update planet position, not the entire scene
                    // This would be more efficient, but for simplicity we're redrawing everything
                }
            }
        })
    })

    return (
        <div className="relative w-full aspect-square">
            <canvas ref={canvasRef} className="w-full h-full" aria-label={`Orbital visualization of ${planetName}`} />
            <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-white/60">
                Orbital period: {orbitalPeriod.toFixed(1)} days
            </div>
        </div>
    )
}

