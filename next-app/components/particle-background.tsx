"use client"

import { useEffect, useRef } from "react"

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number

        // Set canvas dimensions
        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        setCanvasDimensions()
        window.addEventListener("resize", setCanvasDimensions)

        // Particle class
        class Particle {
            x: number
            y: number
            size: number
            speedX: number
            speedY: number
            color: string
            alpha: number

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.size = Math.random() * 1.5 + 0.5
                this.speedX = Math.random() * 0.2 - 0.1
                this.speedY = Math.random() * 0.2 - 0.1
                this.alpha = Math.random() * 0.5 + 0.1 // Initialize alpha first
                this.color = this.getRandomColor()    // Then call getRandomColor()
            }

            getRandomColor = () => {
                const colors = [
                    "rgba(139, 92, 246, alpha)", // Indigo
                    "rgba(168, 85, 247, alpha)", // Purple
                    "rgba(217, 70, 239, alpha)", // Fuchsia
                    "rgba(236, 72, 153, alpha)", // Pink
                    "rgba(99, 102, 241, alpha)", // Blue
                ]

                return colors[Math.floor(Math.random() * colors.length)].replace("alpha", this.alpha.toString())
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                if (this.x > canvas!.width) this.x = 0
                else if (this.x < 0) this.x = canvas!.width

                if (this.y > canvas!.height) this.y = 0
                else if (this.y < 0) this.y = canvas!.height
            }

            draw() {
                ctx!.fillStyle = this.color
                ctx!.beginPath()
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx!.fill()
            }
        }

        // Create particles
        const particles: Particle[] = []
        const particleCount = Math.min(100, (window.innerWidth * window.innerHeight) / 10000)

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle())
        }

        // Animation loop
        const animate = () => {
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

            // Update and draw particles
            particles.forEach((particle) => {
                particle.update()
                particle.draw()
            })

            // Connect particles with lines
            connectParticles()

            animationFrameId = requestAnimationFrame(animate)
        }

        // Connect particles with lines if they are close enough
        const connectParticles = () => {
            const maxDistance = 100

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < maxDistance) {
                        const opacity = 1 - distance / maxDistance
                        ctx!.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.2})`
                        ctx!.lineWidth = 0.5
                        ctx!.beginPath()
                        ctx!.moveTo(particles[i].x, particles[i].y)
                        ctx!.lineTo(particles[j].x, particles[j].y)
                        ctx!.stroke()
                    }
                }
            }
        }

        animate()

        return () => {
            window.removeEventListener("resize", setCanvasDimensions)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" style={{ pointerEvents: "none" }} />
}
