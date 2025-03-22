"use client"

import { useState } from "react"

interface ExoplanetData {
    [key: string]: string | number | boolean | null
    pl_name: string
}

interface UseAIImagesResult {
    images: string[] | null
    isLoading: boolean
    error: string | null
    generateImages: () => Promise<void>
}

export function useAIImages(exoplanetData: ExoplanetData | null): UseAIImagesResult {
    const [images, setImages] = useState<string[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const generateImages = async () => {
        if (!exoplanetData) {
            setError("No exoplanet data available")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Create prompts for different views of the planet
            const prompts = [
                `A photorealistic view of exoplanet ${exoplanetData.pl_name} from space, showing its surface features and atmosphere.`,
                `The surface of exoplanet ${exoplanetData.pl_name}, showing its terrain, atmosphere, and possibly any unique geological features.`,
                `The star system containing exoplanet ${exoplanetData.pl_name}, showing its orbit around its host star.`,
                `A close-up view of interesting geological features on exoplanet ${exoplanetData.pl_name}, such as mountains, canyons, or oceans if applicable.`,
            ]

            // Generate images for each prompt
            const imagePromises = prompts.map(async (prompt) => {
                const response = await fetch("/api/ai/generate-image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt }),
                })

                if (!response.ok) {
                    throw new Error(`Failed to generate image: ${response.statusText}`)
                }

                const data = await response.json()
                return data.imageUrl
            })

            const generatedImages = await Promise.all(imagePromises)
            setImages(generatedImages)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
            console.error("Error generating AI images:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        images,
        isLoading,
        error,
        generateImages,
    }
}

