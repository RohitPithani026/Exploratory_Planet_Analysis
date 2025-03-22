"use client"

import { useEffect, useRef } from "react"

interface HabitabilityGaugeProps {
    score: number
    label: string
    description: string
}

export function HabitabilityGauge({ score, label, description }: HabitabilityGaugeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Normalize score to 0-100 range if it's 0-1
    const normalizedScore = score > 1 ? score : score * 100

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        // Calculate center and radius
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(centerX, centerY) - 10

        // Draw background arc
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
        ctx.lineWidth = 20
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.stroke()

        // Draw score arc
        const scoreAngle = Math.PI - (normalizedScore / 100) * Math.PI

        // Create gradient based on score
        let gradient
        if (normalizedScore > 70) {
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(0, "#10b981")
            gradient.addColorStop(1, "#34d399")
        } else if (normalizedScore > 50) {
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(0, "#3b82f6")
            gradient.addColorStop(1, "#60a5fa")
        } else if (normalizedScore > 30) {
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(0, "#f59e0b")
            gradient.addColorStop(1, "#fbbf24")
        } else if (normalizedScore > 10) {
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(0, "#f97316")
            gradient.addColorStop(1, "#fb923c")
        } else {
            gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(0, "#ef4444")
            gradient.addColorStop(1, "#f87171")
        }

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, Math.PI, scoreAngle, false)
        ctx.lineWidth = 20
        ctx.strokeStyle = gradient
        ctx.lineCap = "round"
        ctx.stroke()

        // Draw center circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius - 40, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
        ctx.fill()

        // Draw score text
        ctx.font = "bold 32px Inter, system-ui, sans-serif"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${Math.round(normalizedScore)}%`, centerX, centerY)

        // Draw tick marks
        for (let i = 0; i <= 10; i++) {
            const angle = Math.PI - (i / 10) * Math.PI
            const tickLength = i % 5 === 0 ? 15 : 7

            const startX = centerX + Math.cos(angle) * (radius + 5)
            const startY = centerY + Math.sin(angle) * (radius + 5)
            const endX = centerX + Math.cos(angle) * (radius + 5 + tickLength)
            const endY = centerY + Math.sin(angle) * (radius + 5 + tickLength)

            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            ctx.lineWidth = i % 5 === 0 ? 2 : 1
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
            ctx.stroke()
        }
    }, [normalizedScore])

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-white mb-2">{label}</h3>
            <p className="text-sm text-white/60 mb-4 text-center">{description}</p>
            <div className="relative w-full h-60">
                <canvas ref={canvasRef} className="w-full h-full" aria-label={`${label} gauge showing ${score}%`} />
            </div>
            <div className="flex justify-between w-full mt-2 text-xs text-white/60">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
            </div>
        </div>
    )
}

