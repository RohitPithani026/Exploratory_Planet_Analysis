"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
    systemTheme: "dark" | "light"
    particleEffects: boolean
    setParticleEffects: (enabled: boolean) => void
    blurEffects: boolean
    setBlurEffects: (enabled: boolean) => void
    animations: boolean
    setAnimations: (enabled: boolean) => void
    reducedMotion: boolean
}

const initialState: ThemeProviderState = {
    theme: "dark",
    setTheme: () => null,
    systemTheme: "dark",
    particleEffects: true,
    setParticleEffects: () => null,
    blurEffects: true,
    setBlurEffects: () => null,
    animations: true,
    setAnimations: () => null,
    reducedMotion: false,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "dark",
    storageKey = "exohabit-theme",
    ...props
}: ThemeProviderProps) {
    const { toast } = useToast()
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark")
    const [particleEffects, setParticleEffects] = useState<boolean>(true)
    const [blurEffects, setBlurEffects] = useState<boolean>(true)
    const [animations, setAnimations] = useState<boolean>(true)
    const [reducedMotion, setReducedMotion] = useState<boolean>(false)

    // Check for stored preferences on mount
    useEffect(() => {
        const loadLocalSettings = () => {
            // Load saved preferences from localStorage
            const savedTheme = localStorage.getItem(`${storageKey}-theme`) as Theme | null
            const savedParticleEffects = localStorage.getItem(`${storageKey}-particleEffects`)
            const savedBlurEffects = localStorage.getItem(`${storageKey}-blurEffects`)
            const savedAnimations = localStorage.getItem(`${storageKey}-animations`)

            if (savedTheme) setTheme(savedTheme)
            if (savedParticleEffects !== null) setParticleEffects(savedParticleEffects === "true")
            if (savedBlurEffects !== null) setBlurEffects(savedBlurEffects === "true")
            if (savedAnimations !== null) setAnimations(savedAnimations === "true")
        }

        loadLocalSettings()
    }, [storageKey])

    // Save settings whenever they change
    useEffect(() => {
        localStorage.setItem(`${storageKey}-theme`, theme)
        localStorage.setItem(`${storageKey}-particleEffects`, String(particleEffects))
        localStorage.setItem(`${storageKey}-blurEffects`, String(blurEffects))
        localStorage.setItem(`${storageKey}-animations`, String(animations))
    }, [theme, particleEffects, blurEffects, animations, storageKey])

    // Check for system theme preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        setSystemTheme(mediaQuery.matches ? "dark" : "light")

        const onMediaChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? "dark" : "light")
        }

        mediaQuery.addEventListener("change", onMediaChange)

        // Check for reduced motion preference
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReducedMotion(motionQuery.matches)

        const onMotionChange = (e: MediaQueryListEvent) => {
            setReducedMotion(e.matches)
        }

        motionQuery.addEventListener("change", onMotionChange)

        return () => {
            mediaQuery.removeEventListener("change", onMediaChange)
            motionQuery.removeEventListener("change", onMotionChange)
        }
    }, [])

    // Apply theme class to document
    useEffect(() => {
        const root = window.document.documentElement
        const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")

        root.classList.remove("light", "dark")
        root.classList.add(isDark ? "dark" : "light")
    }, [theme, systemTheme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            setTheme(theme)
            try {
                toast({
                    title: "Theme changed",
                    description: `Theme set to ${theme === "system" ? "system default" : theme}`,
                })
            } catch (e) {
                console.error("Toast error:", e)
            }
        },
        systemTheme,
        particleEffects,
        setParticleEffects: (enabled: boolean) => {
            setParticleEffects(enabled)
            try {
                toast({
                    title: "Visual effects updated",
                    description: `Particle effects ${enabled ? "enabled" : "disabled"}`,
                })
            } catch (e) {
                console.error("Toast error:", e)
            }
        },
        blurEffects,
        setBlurEffects: (enabled: boolean) => {
            setBlurEffects(enabled)
            try {
                toast({
                    title: "Visual effects updated",
                    description: `Blur effects ${enabled ? "enabled" : "disabled"}`,
                })
            } catch (e) {
                console.error("Toast error:", e)
            }
        },
        animations,
        setAnimations: (enabled: boolean) => {
            setAnimations(enabled)
            try {
                toast({
                    title: "Visual effects updated",
                    description: `Animations ${enabled ? "enabled" : "disabled"}`,
                })
            } catch (e) {
                console.error("Toast error:", e)
            }
        },
        reducedMotion,
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

    return context
}

