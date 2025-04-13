"use client"

import { useRef, useEffect, useMemo } from "react"
import { useTheme } from "@/components/theme-provider"
import { useWindowSize } from "@/hooks/useWindowSize"

export function RotatingPlanet({
    position = "right"
}: {
    position?: "left" | "right" | "center"
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { reducedMotion } = useTheme()
    const { width } = useWindowSize()

    // Responsive size
    const size = useMemo(() => {
        if (width >= 1280) return 1000      // xl, 2xl screens
        if (width >= 768) return 700        // md, lg screens
        return 400                          // mobile
    }, [width])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = size
        canvas.height = size

        const planetRadius = size * 0.35
        const ringRadius = size * 0.45
        const ringWidth = size * 0.05
        let rotation = 0
        let animationFrameId: number

        const drawPlanet = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const glowGradient = ctx.createRadialGradient(
                size / 2,
                size / 2,
                planetRadius * 0.8,
                size / 2,
                size / 2,
                planetRadius * 1.3
            )
            glowGradient.addColorStop(0, "rgba(138, 43, 226, 0.4)")
            glowGradient.addColorStop(1, "rgba(138, 43, 226, 0)")

            ctx.fillStyle = glowGradient
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, planetRadius * 1.3, 0, Math.PI * 2)
            ctx.fill()

            const planetGradient = ctx.createRadialGradient(
                size / 2 - planetRadius * 0.3,
                size / 2 - planetRadius * 0.3,
                0,
                size / 2,
                size / 2,
                planetRadius
            )
            planetGradient.addColorStop(0, "#9333ea")
            planetGradient.addColorStop(0.5, "#6366f1")
            planetGradient.addColorStop(1, "#312e81")

            ctx.fillStyle = planetGradient
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, planetRadius, 0, Math.PI * 2)
            ctx.fill()

            ctx.save()
            ctx.globalCompositeOperation = "overlay"

            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2
                const distance = Math.random() * planetRadius * 0.7
                const x = size / 2 + Math.cos(angle) * distance
                const y = size / 2 + Math.sin(angle) * distance
                const craterSize =
                    Math.random() * planetRadius * 0.15 + planetRadius * 0.05

                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`
                ctx.beginPath()
                ctx.arc(x, y, craterSize, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.restore()

            ctx.save()
            ctx.translate(size / 2, size / 2)
            ctx.rotate(rotation)

            const ringGradient = ctx.createLinearGradient(-ringRadius, 0, ringRadius, 0)
            ringGradient.addColorStop(0, "rgba(138, 43, 226, 0.1)")
            ringGradient.addColorStop(0.5, "rgba(138, 43, 226, 0.6)")
            ringGradient.addColorStop(1, "rgba(138, 43, 226, 0.1)")

            ctx.strokeStyle = ringGradient
            ctx.lineWidth = ringWidth
            ctx.beginPath()
            ctx.ellipse(0, 0, ringRadius, ringRadius * 0.3, 0, 0, Math.PI * 2)
            ctx.stroke()

            ctx.restore()

            if (!reducedMotion) rotation += 0.005

            animationFrameId = requestAnimationFrame(drawPlanet)
        }

        drawPlanet()

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
