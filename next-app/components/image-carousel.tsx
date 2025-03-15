"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import Image from "next/image"

interface ImageCarouselProps {
    images: {
        src: string
        alt: string
        caption?: string
    }[]
    interval?: number
    className?: string
}

export function ImageCarousel({ images, interval = 5000, className = "" }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const { reducedMotion } = useTheme()

    useEffect(() => {
        if (reducedMotion || isHovering) return

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, interval)

        return () => clearInterval(timer)
    }, [images.length, interval, reducedMotion, isHovering])

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900/30 to-transparent"></div>

            <div className="relative aspect-video overflow-hidden rounded-xl">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        <Image
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            width={800}
                            height={400}
                            className="h-full w-full object-cover"
                        />

                        {image.caption && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white text-sm py-1 px-3 rounded-lg max-w-[90%]"
                                style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'white',
                                    fontWeight: '500',
                                    letterSpacing: '0.5px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                {image.caption}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white"
                aria-label="Previous image"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white"
                aria-label="Next image"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 w-6 rounded-full transition-all ${index === currentIndex ? "bg-indigo-500" : "bg-white/30"
                            }`}
                        aria-label={`Go to image ${index + 1}`} />
                ))}
            </div>
        </div>
    )
}
