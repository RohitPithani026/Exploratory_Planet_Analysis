"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type ColorScheme = "cosmic-indigo" | "nebula-blue" | "stellar-green" | "solar-orange"

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    defaultColorScheme?: ColorScheme
    storageKey?: string
}

interface ThemeProviderState {
    theme: Theme
    colorScheme: ColorScheme
    setTheme: (theme: Theme) => void
    setColorScheme: (colorScheme: ColorScheme) => void
    systemTheme: "dark" | "light"
    particleEffects: boolean
    setParticleEffects: (enabled: boolean) => void
    blurEffects: boolean
    setBlurEffects: (enabled: boolean) => void
    animations: boolean
    setAnimations: (enabled: boolean) => void
    compactMode: boolean
    setCompactMode: (enabled: boolean) => void
    persistentSidebar: boolean
    setPersistentSidebar: (enabled: boolean) => void
    fontFamily: string
    setFontFamily: (font: string) => void
    fontSize: string
    setFontSize: (size: string) => void
    reducedMotion: boolean
    setReducedMotion: (enabled: boolean) => void
}

const initialState: ThemeProviderState = {
    theme: "dark",
    colorScheme: "cosmic-indigo",
    setTheme: () => null,
    setColorScheme: () => null,
    systemTheme: "dark",
    particleEffects: true,
    setParticleEffects: () => null,
    blurEffects: true,
    setBlurEffects: () => null,
    animations: true,
    setAnimations: () => null,
    compactMode: false,
    setCompactMode: () => null,
    persistentSidebar: true,
    setPersistentSidebar: () => null,
    fontFamily: "inter",
    setFontFamily: () => null,
    fontSize: "medium",
    setFontSize: () => null,
    reducedMotion: false,
    setReducedMotion: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "dark",
    defaultColorScheme = "cosmic-indigo",
    storageKey = "exohabit-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme)
    const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark")
    const [particleEffects, setParticleEffects] = useState<boolean>(true)
    const [blurEffects, setBlurEffects] = useState<boolean>(true)
    const [animations, setAnimations] = useState<boolean>(true)
    const [compactMode, setCompactMode] = useState<boolean>(false)
    const [persistentSidebar, setPersistentSidebar] = useState<boolean>(true)
    const [fontFamily, setFontFamily] = useState<string>("inter")
    const [fontSize, setFontSize] = useState<string>("medium")
    const [reducedMotion, setReducedMotion] = useState<boolean>(false)

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const root = window.document.documentElement;

        // Load saved preferences from localStorage
        const savedTheme = localStorage.getItem(`${storageKey}-theme`) as Theme | null
        const savedColorScheme = localStorage.getItem(`${storageKey}-colorScheme`) as ColorScheme | null
        const savedParticleEffects = localStorage.getItem(`${storageKey}-particleEffects`)
        const savedBlurEffects = localStorage.getItem(`${storageKey}-blurEffects`)
        const savedAnimations = localStorage.getItem(`${storageKey}-animations`)
        const savedCompactMode = localStorage.getItem(`${storageKey}-compactMode`)
        const savedPersistentSidebar = localStorage.getItem(`${storageKey}-persistentSidebar`)
        const savedFontFamily = localStorage.getItem(`${storageKey}-fontFamily`)
        const savedFontSize = localStorage.getItem(`${storageKey}-fontSize`)

        if (savedTheme) setTheme(savedTheme)
        if (savedColorScheme) setColorScheme(savedColorScheme)
        if (savedParticleEffects !== null) setParticleEffects(savedParticleEffects === "true")
        if (savedBlurEffects !== null) setBlurEffects(savedBlurEffects === "true")
        if (savedAnimations !== null) setAnimations(savedAnimations === "true")
        if (savedCompactMode !== null) setCompactMode(savedCompactMode === "true")
        if (savedPersistentSidebar !== null) setPersistentSidebar(savedPersistentSidebar === "true")
        if (savedFontFamily) setFontFamily(savedFontFamily)
        if (savedFontSize) setFontSize(savedFontSize)

        // Check for system theme preference
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        setSystemTheme(mediaQuery.matches ? "dark" : "light")

        const onMediaChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? "dark" : "light")
        }

        mediaQuery.addEventListener("change", onMediaChange)

        return () => {
            mediaQuery.removeEventListener("change", onMediaChange)
        }
    }, [storageKey])

    useEffect(() => {
        const root = window.document.documentElement
        const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")

        // Apply theme class
        root.classList.remove("light", "dark")
        root.classList.add(isDark ? "dark" : "light")

        // Apply color scheme
        root.style.setProperty("--color-scheme", colorScheme)

        // Apply font family
        root.style.setProperty("--font-family", fontFamily)

        // Apply font size
        root.style.setProperty("--font-size", fontSize === "small" ? "0.875" : fontSize === "large" ? "1.125" : "1")

        // Apply compact mode
        root.style.setProperty("--spacing-multiplier", compactMode ? "0.75" : "1")

        // Save preferences to localStorage
        localStorage.setItem(`${storageKey}-theme`, theme)
        localStorage.setItem(`${storageKey}-colorScheme`, colorScheme)
        localStorage.setItem(`${storageKey}-particleEffects`, String(particleEffects))
        localStorage.setItem(`${storageKey}-blurEffects`, String(blurEffects))
        localStorage.setItem(`${storageKey}-animations`, String(animations))
        localStorage.setItem(`${storageKey}-compactMode`, String(compactMode))
        localStorage.setItem(`${storageKey}-persistentSidebar`, String(persistentSidebar))
        localStorage.setItem(`${storageKey}-fontFamily`, fontFamily)
        localStorage.setItem(`${storageKey}-fontSize`, fontSize)
    }, [
        theme,
        colorScheme,
        systemTheme,
        storageKey,
        particleEffects,
        blurEffects,
        animations,
        compactMode,
        persistentSidebar,
        fontFamily,
        fontSize,
    ])

    const value = {
        theme,
        colorScheme,
        setTheme,
        setColorScheme,
        systemTheme,
        particleEffects,
        setParticleEffects,
        blurEffects,
        setBlurEffects,
        animations,
        setAnimations,
        compactMode,
        setCompactMode,
        persistentSidebar,
        setPersistentSidebar,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        reducedMotion,
        setReducedMotion,
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