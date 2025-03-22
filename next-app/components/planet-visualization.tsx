"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface PlanetVisualizationProps {
    planetType: string
    planetColor: string
    planetName: string
}

export function PlanetVisualization({ planetType, planetColor, planetName }: PlanetVisualizationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [rotation, setRotation] = useState(0)
    const [hovering, setHovering] = useState(false)

    // Get base color based on planet type
    const getBaseColor = () => {
        switch (planetType) {
            case "Earth-like":
                return { r: 65, g: 105, b: 225 } // Blue with green
            case "Super-Earth":
                return { r: 70, g: 130, b: 180 } // Steel blue
            case "Neptune-like":
                return { r: 100, g: 149, b: 237 } // Cornflower blue
            case "Gas Giant":
                return { r: 139, g: 69, b: 19 } // Saddle brown (Jupiter-like)
            case "Sub-Earth":
                return { r: 210, g: 180, b: 140 } // Tan/brown
            default:
                return { r: 128, g: 128, b: 128 } // Gray
        }
    }

    // Get atmosphere color based on planet type
    const getAtmosphereColor = () => {
        switch (planetType) {
            case "Earth-like":
                return "rgba(255, 255, 255, 0.2)" // White haze
            case "Super-Earth":
                return "rgba(173, 216, 230, 0.3)" // Light blue
            case "Neptune-like":
                return "rgba(135, 206, 250, 0.4)" // Sky blue
            case "Gas Giant":
                return "rgba(222, 184, 135, 0.3)" // Tan
            case "Sub-Earth":
                return "rgba(255, 228, 196, 0.2)" // Bisque
            default:
                return "rgba(255, 255, 255, 0.1)" // Transparent white
        }
    }

    // Draw the planet
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(centerX, centerY) - 20

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Base planet color
        const baseColor = getBaseColor()

        // Create gradient for planet
        const gradient = ctx.createRadialGradient(centerX - radius / 3, centerY - radius / 3, 0, centerX, centerY, radius)

        // Add color stops to gradient
        gradient.addColorStop(0, `rgb(${baseColor.r + 40}, ${baseColor.g + 40}, ${baseColor.b + 40})`)
        gradient.addColorStop(0.5, `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`)
        gradient.addColorStop(1, `rgb(${baseColor.r - 40}, ${baseColor.g - 40}, ${baseColor.b - 40})`)

        // Draw planet
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw surface features based on planet type
        if (planetType === "Earth-like" || planetType === "Super-Earth") {
            // Draw continents
            const continentColor = `rgba(${baseColor.r - 50}, ${baseColor.g + 20}, ${baseColor.b - 100}, 0.7)`
            ctx.fillStyle = continentColor

            // Rotate the canvas for animation
            ctx.save()
            ctx.translate(centerX, centerY)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.translate(-centerX, -centerY)

            // Draw random continent shapes
            for (let i = 0; i < 7; i++) {
                ctx.beginPath()
                const startX = centerX + (Math.random() - 0.5) * radius * 1.5
                const startY = centerY + (Math.random() - 0.5) * radius * 1.5
                ctx.moveTo(startX, startY)

                // Create irregular shape
                for (let j = 0; j < 5; j++) {
                    const cpX1 = startX + (Math.random() - 0.5) * radius * 0.8
                    const cpY1 = startY + (Math.random() - 0.5) * radius * 0.8
                    const cpX2 = startX + (Math.random() - 0.5) * radius * 0.8
                    const cpY2 = startY + (Math.random() - 0.5) * radius * 0.8
                    const endX = startX + (Math.random() - 0.5) * radius * 0.8
                    const endY = startY + (Math.random() - 0.5) * radius * 0.8
                    ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, endX, endY)
                }

                ctx.closePath()
                ctx.fill()
            }

            // Draw cloud patterns
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
            for (let i = 0; i < 10; i++) {
                ctx.beginPath()
                const cloudX = centerX + (Math.random() - 0.5) * radius * 2
                const cloudY = centerY + (Math.random() - 0.5) * radius * 2
                const cloudRadius = Math.random() * radius * 0.2 + radius * 0.05
                ctx.arc(cloudX, cloudY, cloudRadius, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.restore()
        } else if (planetType === "Neptune-like" || planetType === "Gas Giant") {
            // Draw bands for gas giants
            ctx.save()
            ctx.translate(centerX, centerY)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.translate(-centerX, -centerY)

            // Draw bands
            for (let i = 0; i < 7; i++) {
                const bandWidth = radius * 0.15
                const bandColor =
                    i % 2 === 0
                        ? `rgba(${baseColor.r + 20}, ${baseColor.g + 20}, ${baseColor.b + 20}, 0.4)`
                        : `rgba(${baseColor.r - 20}, ${baseColor.g - 20}, ${baseColor.b - 20}, 0.4)`

                ctx.fillStyle = bandColor
                ctx.beginPath()
                ctx.ellipse(centerX, centerY, radius, bandWidth, 0, 0, Math.PI * 2)
                ctx.fill()
            }

            // Draw storm features
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
            for (let i = 0; i < 5; i++) {
                const stormX = centerX + (Math.random() - 0.5) * radius * 1.5
                const stormY = centerY + (Math.random() - 0.5) * radius * 0.8
                const stormRadius = Math.random() * radius * 0.15 + radius * 0.05

                ctx.beginPath()
                ctx.ellipse(stormX, stormY, stormRadius, stormRadius * 0.6, 0, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.restore()
        } else {
            // Draw craters for rocky planets
            ctx.save()
            ctx.translate(centerX, centerY)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.translate(-centerX, -centerY)

            for (let i = 0; i < 15; i++) {
                const craterX = centerX + (Math.random() - 0.5) * radius * 1.5
                const craterY = centerY + (Math.random() - 0.5) * radius * 1.5
                const craterRadius = Math.random() * radius * 0.1 + radius * 0.02

                // Crater rim
                ctx.beginPath()
                ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${baseColor.r - 30}, ${baseColor.g - 30}, ${baseColor.b - 30}, 0.7)`
                ctx.fill()

                // Crater center
                ctx.beginPath()
                ctx.arc(craterX, craterY, craterRadius * 0.7, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${baseColor.r - 10}, ${baseColor.g - 10}, ${baseColor.b - 10}, 0.7)`
                ctx.fill()
            }

            ctx.restore()
        }

        // Draw atmosphere glow
        const atmosphereGradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius * 1.2)
        atmosphereGradient.addColorStop(0, getAtmosphereColor())
        atmosphereGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2)
        ctx.fillStyle = atmosphereGradient
        ctx.fill()

        // Draw highlight
        ctx.beginPath()
        ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)"
        ctx.fill()
    }, [planetType, rotation])

    // Animate rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setRotation((prev) => (prev + (hovering ? 0.5 : 0.2)) % 360)
        }, 50)
        return () => clearInterval(interval)
    }, [hovering])

    return (
        <div className="relative w-full aspect-square max-w-[300px] mx-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative w-full h-full"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <canvas ref={canvasRef} width={300} height={300} className="w-full h-full" />

                {/* Glow effect */}
                <div
                    className="absolute inset-0 rounded-full opacity-30 blur-xl"
                    style={{
                        background: `radial-gradient(circle, ${planetColor}, transparent 70%)`,
                    }}
                />

                {/* Stars background */}
                <div className="absolute inset-0 -z-10">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-[1px] h-[1px] bg-white rounded-full animate-twinkle"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.7 + 0.3,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            <div className="left-0 right-0 text-center text-xs text-white/60">
                {planetName} ({planetType})
            </div>
        </div>
    )
}

