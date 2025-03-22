"use client"

import { useState } from "react"

interface ExoplanetData {
    [key: string]: string | number | boolean | null
    pl_name: string
}

interface UseAIContentResult {
    summary: string | null
    imagePrompts: string[] | null
    isLoadingSummary: boolean
    isLoadingImages: boolean
    error: string | null
    generateSummary: () => Promise<void>
    generateImagePrompts: () => Promise<void>
}

export function useAIContent(exoplanetData: ExoplanetData | null): UseAIContentResult {
    const [summary, setSummary] = useState<string | null>(null)
    const [imagePrompts, setImagePrompts] = useState<string[] | null>(null)
    const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false)
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const generateSummary = async () => {
        if (!exoplanetData) {
            setError("No exoplanet data available")
            return
        }

        setIsLoadingSummary(true)
        setError(null)

        try {
            const response = await fetch("/api/ai/generate-content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planetData: exoplanetData,
                    contentType: "summary",
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate summary")
            }

            if (data.success && data.summary) {
                setSummary(data.summary)
            } else {
                throw new Error("No summary was generated")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            console.error("Error generating AI summary:", err)
        } finally {
            setIsLoadingSummary(false)
        }
    }

    const generateImagePrompts = async () => {
        if (!exoplanetData) {
            setError("No exoplanet data available")
            return
        }

        setIsLoadingImages(true)
        setError(null)

        try {
            const response = await fetch("/api/ai/generate-content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planetData: exoplanetData,
                    contentType: "image",
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate image prompts")
            }

            if (data.success && data.imagePrompts) {
                setImagePrompts(data.imagePrompts)
            } else {
                throw new Error("No image prompts were generated")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            console.error("Error generating AI image prompts:", err)
        } finally {
            setIsLoadingImages(false)
        }
    }

    return {
        summary,
        imagePrompts,
        isLoadingSummary,
        isLoadingImages,
        error,
        generateSummary,
        generateImagePrompts,
    }
}

