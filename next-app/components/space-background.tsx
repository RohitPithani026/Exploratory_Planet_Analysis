"use client"

import { useEffect, useRef } from "react"

export function SpaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement
        if (!canvas) return

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
        if (!ctx) return

        let animationFrameId: number

        // Set canvas dimensions
        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        setCanvasDimensions()
        window.addEventListener("resize", setCanvasDimensions)

        // Star class
        class Star {
            x: number
            y: number
            size: number
            color: string
            twinkleSpeed: number
            twinklePhase: number

            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 1.5 + 0.5
                this.color = this.getRandomColor()
                this.twinkleSpeed = Math.random() * 0.05 + 0.01
                this.twinklePhase = Math.random() * Math.PI * 2
            }

            getRandomColor() {
                const colors = [
                    "#ffffff",
                    "#f8f9fa",
                    "#e9ecef",
                    "#dee2e6",
                    "#adb5bd",
                    "#a5b4fc",
                    "#c4b5fd",
                    "#93c5fd",
                ]
                return colors[Math.floor(Math.random() * colors.length)]
            }

            update() {
                this.twinklePhase += this.twinkleSpeed
                if (this.twinklePhase > Math.PI * 2) {
                    this.twinklePhase = 0
                }
            }

            draw() {
                const alpha = (Math.sin(this.twinklePhase) + 1) * 0.5 * 0.7 + 0.3
                ctx.globalAlpha = alpha
                ctx.fillStyle = this.color
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
                ctx.globalAlpha = 1
            }
        }

        // Create stars
        const stars: Star[] = []
        const starCount = Math.min(200, (window.innerWidth * window.innerHeight) / 5000)

        for (let i = 0; i < starCount; i++) {
            stars.push(new Star())
        }

        // Nebula class for background color clouds
        class Nebula {
            x: number
            y: number
            radius: number
            color: string

            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.radius = Math.random() * 300 + 100
                this.color = this.getRandomColor()
            }

            getRandomColor() {
                const colors = [
                    "rgba(76, 29, 149, 0.05)",
                    "rgba(91, 33, 182, 0.05)",
                    "rgba(124, 58, 237, 0.05)",
                    "rgba(139, 92, 246, 0.05)",
                    "rgba(167, 139, 250, 0.05)",
                    "rgba(55, 48, 163, 0.05)",
                ]
                return colors[Math.floor(Math.random() * colors.length)]
            }

            draw() {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
                gradient.addColorStop(0, this.color)
                gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // Create nebulas
        const nebulas: Nebula[] = []
        const nebulaCount = 5

        for (let i = 0; i < nebulaCount; i++) {
            nebulas.push(new Nebula())
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw nebulas
            nebulas.forEach((nebula) => {
                nebula.draw()
            })

            // Update and draw stars
            stars.forEach((star) => {
                star.update()
                star.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", setCanvasDimensions)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60" style={{ pointerEvents: "none" }} />
}
