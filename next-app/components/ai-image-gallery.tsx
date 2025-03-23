"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface AIImageGalleryProps {
    images: string[] | null
    isLoading: boolean
    error: string | null
    onGenerate: () => void
    planetName: string
}

export function AIImageGallery({ images, isLoading, error, onGenerate, planetName }: AIImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)

    // For demo purposes, we'll use placeholder images if no AI images are available
    const placeholderImages = [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
    ]

    const displayImages = images || placeholderImages

    const getImageCaption = (index: number) => {
        if (index === 0) return `Space view of ${planetName}`
        if (index === 1) return `Surface of ${planetName}`
        if (index === 2) return `Star system of ${planetName}`
        if (index === 3) return `Geological features of ${planetName}`

        return `AI visualization of ${planetName}`
    }

    // Auto-rotate images when not hovering
    useEffect(() => {
        if (isHovering) return

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % displayImages.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isHovering, displayImages.length])

    return (
        <Card
            className="bg-black/40 border-white/10 text-white backdrop-blur-sm overflow-hidden relative group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-xl font-display">
                    <ImageIcon className="mr-2 h-5 w-5 text-indigo-400" />
                    AI-Generated Visualizations
                </CardTitle>
                <CardDescription className="text-white/60 font-body">
                    Explore AI-generated visualizations of {planetName}
                </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin animation-delay-150"></div>
                        </div>
                        <p className="text-white/70 mt-4 font-body">Generating visualizations of {planetName}...</p>
                        <p className="text-white/50 text-sm mt-2 font-body">This may take a few moments</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-white/80">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                                <p className="font-medium font-display">Failed to generate visualizations</p>
                                <p className="text-sm text-white/60 mt-1 font-body">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={displayImages[activeIndex] || "/placeholder.svg"}
                                        alt={getImageCaption(activeIndex)}
                                        fill
                                        className="object-cover rounded-lg"
                                        sizes="(max-width: 768px) 100vw, 800px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center text-sm text-white/90 backdrop-blur-sm font-body">
                                        {getImageCaption(activeIndex)}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation buttons */}
                        <button
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white"
                            onClick={() => setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white"
                            onClick={() => setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Dots for carousel */}
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-1">
                            {displayImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-6 bg-indigo-500" : "w-1.5 bg-white/30"
                                        }`}
                                    onClick={() => setActiveIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="relative z-10 pt-0">
                <Button
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-body"
                    onClick={onGenerate}
                    disabled={isLoading}
                >
                    {images ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Regenerate Visualizations
                        </>
                    ) : (
                        <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Generate AI Visualizations
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

