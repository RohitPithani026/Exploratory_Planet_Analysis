"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"

export function RotatingPlanet({ size = 300, position = "right" }: { size?: number; position?: "left" | "right" | "center" }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { reducedMotion } = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        canvas.width = size
        canvas.height = size

        // Planet properties
        const planetRadius = size * 0.35
        const ringRadius = size * 0.45
        const ringWidth = size * 0.05

        // Animation properties
        let rotation = 0
        let animationFrameId: number

        // Draw planet
        const drawPlanet = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw planet glow
            const glowGradient = ctx.createRadialGradient(
                size / 2,
                size / 2,
                planetRadius * 0.8,
                size / 2,
                size / 2,
                planetRadius * 1.3,
            )
            glowGradient.addColorStop(0, "rgba(138, 43, 226, 0.4)")
            glowGradient.addColorStop(1, "rgba(138, 43, 226, 0)")

            ctx.fillStyle = glowGradient
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, planetRadius * 1.3, 0, Math.PI * 2)
            ctx.fill()

            // Draw planet
            const planetGradient = ctx.createRadialGradient(
                size / 2 - planetRadius * 0.3,
                size / 2 - planetRadius * 0.3,
                0,
                size / 2,
                size / 2,
                planetRadius,
            )
            planetGradient.addColorStop(0, "#9333ea")
            planetGradient.addColorStop(0.5, "#6366f1")
            planetGradient.addColorStop(1, "#312e81")

            ctx.fillStyle = planetGradient
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, planetRadius, 0, Math.PI * 2)
            ctx.fill()

            // Draw planet surface details
            ctx.save()
            ctx.globalCompositeOperation = "overlay"

            // Random craters and surface features
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2
                const distance = Math.random() * planetRadius * 0.7
                const x = size / 2 + Math.cos(angle) * distance
                const y = size / 2 + Math.sin(angle) * distance
                const craterSize = Math.random() * planetRadius * 0.15 + planetRadius * 0.05

                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`
                ctx.beginPath()
                ctx.arc(x, y, craterSize, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.restore()

            // Draw rings
            ctx.save()
            ctx.translate(size / 2, size / 2)
            ctx.rotate(rotation)

            // Create ring gradient
            const ringGradient = ctx.createLinearGradient(-ringRadius, 0, ringRadius, 0)
            ringGradient.addColorStop(0, "rgba(138, 43, 226, 0.1)")
            ringGradient.addColorStop(0.5, "rgba(138, 43, 226, 0.6)")
            ringGradient.addColorStop(1, "rgba(138, 43, 226, 0.1)")

            // Draw elliptical ring
            ctx.strokeStyle = ringGradient
            ctx.lineWidth = ringWidth
            ctx.beginPath()
            ctx.ellipse(0, 0, ringRadius, ringRadius * 0.3, 0, 0, Math.PI * 2)
            ctx.stroke()

            ctx.restore()

            // Update rotation for next frame
            if (!reducedMotion) {
                rotation += 0.005
            }

            // Request next frame
            animationFrameId = requestAnimationFrame(drawPlanet)
        }

        // Start animation
        drawPlanet()

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [size, reducedMotion])

    const positionClass =
        position === "left"
            ? "left-0 -translate-x-1/2"
            : position === "right"
                ? "right-0 translate-x-1/2"
                : "left-1/2 -translate-x-1/2"

    return (
        <div className={`absolute top-1/2 -translate-y-1/2 ${positionClass} z-0 opacity-80 pointer-events-none`}>
            <canvas ref={canvasRef} width={size} height={size} />
        </div>
    )
}