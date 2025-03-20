"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface CosmicBackgroundProps {
    children?: React.ReactNode
    intensity?: number
    color?: string
    particleCount?: number
}

export function CosmicBackground({
    children,
    intensity = 0.05,
    color = "rgba(139, 92, 246, 0.5)",
    particleCount = 20,
}: CosmicBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; opacity: number }>>([])

    // Initialize dimensions and particles
    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect()
            setDimensions({ width, height })

            // Create random particles
            const newParticles = Array.from({ length: particleCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.5 + 0.2,
            }))

            setParticles(newParticles)
        }

        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect()
                setDimensions({ width, height })
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [particleCount])

    // Track mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const { left, top } = containerRef.current.getBoundingClientRect()
                setMousePosition({
                    x: e.clientX - left,
                    y: e.clientY - top,
                })
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden">
            {/* Cosmic background with particles */}
            <div className="absolute inset-0 bg-[#030014] z-0">
                {/* Animated glow that follows mouse */}
                <motion.div
                    className="absolute rounded-full blur-[100px] opacity-30"
                    animate={{
                        x: mousePosition.x - 150,
                        y: mousePosition.y - 150,
                    }}
                    transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 50,
                        mass: 0.5,
                    }}
                    style={{
                        width: 300,
                        height: 300,
                        background: color,
                    }}
                />

                {/* Static particles */}
                {particles.map((particle, index) => (
                    <motion.div
                        key={index}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: particle.x,
                            top: particle.y,
                            width: particle.size,
                            height: particle.size,
                            opacity: particle.opacity,
                        }}
                        animate={{
                            x: [(mousePosition.x - particle.x) * intensity * (Math.random() * 0.5 + 0.5), 0],
                            y: [(mousePosition.y - particle.y) * intensity * (Math.random() * 0.5 + 0.5), 0],
                            opacity: [particle.opacity * 1.5, particle.opacity],
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeOut",
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    )
}

